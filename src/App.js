import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";

const styles = {
  width: "100vw",
  height: "calc(100vh - 80px)",
  position: "absolute"
};

// Using https://sparkgeo.com/blog/build-a-react-mapboxgl-component-with-hooks/

mapboxgl.accessToken =
  'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

const addDraggablePoint = (map, point, color) => {
  return new mapboxgl.Marker({
    color,
    draggable: true
  }).setLngLat(point)
  .addTo(map);
}

const Map = () => {
  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-74.5);
  const [lat, setLat] = useState(40.1);
  const [zoom, setZoom] = useState(9);

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
    
      
    
      var src_point = addDraggablePoint(map, [-74.5, 40], "#FFFFFF")
      var destination_point = addDraggablePoint(map, [-74.5, 40.1], "#fc03d3")
    
      const request_url = "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/-73.9913719052481%2C40.73419007010716%3B-73.98619375981075%2C40.73399458227968?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1IjoicGF0d2FyZHMiLCJhIjoiY2tmZzYwenZ4MDRvaDJxcTljc3EyNWxlYSJ9.cxQNQOhFMdUbgWSoaAPrng"
      const response = fetch(request_url)
                        .then(response => response.json())
                        .then(data => console.log(data))
    });

    // Add navigation control (the +/- zoom buttons)
    //map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    /*
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });
    */
    

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className='map-container' ref={mapContainerRef} style={styles} />
    </div>
  );
};

export default Map;