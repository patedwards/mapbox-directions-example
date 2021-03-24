import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';



const styles = {
  width: "100vw",
  height: "calc(100vh - 80px)",
  position: "absolute"
};

// Using https://sparkgeo.com/blog/build-a-react-mapboxgl-component-with-hooks/

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const addGeocoder = (map, point, color, setPoint) => {
  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: false,
    mapboxgl: mapboxgl
    });
  map.addControl(geocoder);
  geocoder.on('result', e => {
      const marker = new mapboxgl.Marker({
        draggable: true,
        color: color
      })
      .setLngLat(e.result.center)
      .addTo(map)
      marker.on('dragend', e => {
        console.log("Dragged", e);
        setPoint([e.target._lngLat.lng, e.target._lngLat.lat])
      })
    })
}

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-74.5);
  const [lat, setLat] = useState(40.1);
  const [zoom, setZoom] = useState(9);

  const [routes, setRoutes] = useState([])
  const [routeEndpoint, setRouteEndpoint] = useState([-74.5, 40])
  const [routeStartpoint, setRouteStartpoint] = useState([-74.5, 40.1])

  // Initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    map.on('load', () => {
      // TODO Add Source
      // TODO Add layers for lines
      // TODO Add draggable point
      // TODO Add a geocoder
      // TODO Add results to map
      // TODO Calculate routes
      // TODO Add animation function
      // TODO Add functions for querying POI
      // Set options
    
      
    
      var src_point = addGeocoder(map, routeEndpoint, "#FFFFFF", setRouteEndpoint)
      var destination_point = addGeocoder(map, routeStartpoint, "#fc03d3", setRouteStartpoint)
      console.log("routes", routes)
      map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': routes.length > 0? routes[0].geometry : []
          },
        });
        map.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': '#888',
        'line-width': 8
        }
        });
    
    });

    // Add navigation control (the +/- zoom buttons)
    //map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    map.on('sourcedata', () => {
      //setLng(map.getCenter().lng.toFixed(4));
      //setLat(map.getCenter().lat.toFixed(4));
      //setZoom(map.getZoom().toFixed(2));
    });
    
    // Clean up on unmount
    return () => map.remove();
  }, [routes]); // eslint-disable-line react-hooks/exhaustive-deps
  // I don't love doing this re-render, need to learn more about ways of using things like map.on to manage map state

  useEffect(() => {
    console.log(routeEndpoint, routeStartpoint)
    const request_url = "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/" + routeStartpoint[0] + "%2C" + routeStartpoint[1] + "%3B" + routeEndpoint[0] + "%2C" + routeEndpoint[1] + "?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1IjoicGF0d2FyZHMiLCJhIjoiY2tmZzYwenZ4MDRvaDJxcTljc3EyNWxlYSJ9.cxQNQOhFMdUbgWSoaAPrng"
    
    const response = fetch(request_url)
                        .then(response => response.json())
                        .then(data => {console.log(data); setRoutes(data.routes.map(route => ({geometry: route.geometry})))})

  }, [routeEndpoint, routeStartpoint])

  return (
    <div>
      <div className='map-container' ref={mapContainerRef} style={styles} />
    </div>
  );
};

export default Map;