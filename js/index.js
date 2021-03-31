import { MapboxInfoBoxControl } from "mapbox-gl-infobox";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
const mapboxgl = require('mapbox-gl');
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import * as turf from '@turf/turf'


mapboxgl.accessToken =
  'pk.eyJ1IjoibWJ4c29sdXRpb25zIiwiYSI6ImNqeWhpandmazAyYmYzYnBtZzJxM3hlM2EifQ.ZLKIqBxG97_HklFj0_1RBQ';

 
const createMarker = (color, coords, map, markerId) => {
  console.log("marker coords", coords)
  map.addSource(markerId, {
    type: 'geojson',
    data: {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [coords.lng, coords.lat]
      }
    }]
    }
  })



  /*
  Ideally I'd have the start and endpoints in the same source and layer, but this is a bit simpler to implement for now.
  */

  map.addLayer({
    'id': markerId + "-layer",
    'type': 'circle',
    'source': markerId,
    'layout': {},
    'paint': {
      'circle-radius': 6,
      'circle-color': '#B42222'
      },
    });

  const marker = new mapboxgl.Marker(
    {draggable: true, color}
  )
    .setLngLat(coords)
    .addTo(map)
    
  marker.on('dragend', e => {
      console.log("Dragged", e);
      //setPoint([e.target._lngLat.lng, e.target._lngLat.lat])
      map.getSource(markerId).setData({
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "properties": {},
          "geometry": {
            "type": "Point",
            "coordinates": [e.target._lngLat.lng, e.target._lngLat.lat]
          }
        }]
        })
      })
  return marker
}

async function createRoute(routeStartpoint, routeEndpoint, routeType) {
  const request_url = "https://api.mapbox.com/directions/v5/mapbox/" + routeType + "/" + routeStartpoint[0] + "%2C" + routeStartpoint[1] + "%3B" + routeEndpoint[0] + "%2C" + routeEndpoint[1] + "?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1IjoicGF0d2FyZHMiLCJhIjoiY2tmZzYwenZ4MDRvaDJxcTljc3EyNWxlYSJ9.cxQNQOhFMdUbgWSoaAPrng"
  const response = await fetch(request_url)
  return await response.json()
}

const map = new mapboxgl.Map({
  container: 'map', // container id
  // TODO Add a custom style
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  // TODO Localize the map to the user's location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 1, // starting zoom
});

map.on('load', () => {
  /* 
  Create Marker creates the marker - which can be dragged - as well as the source and layer data. Doing it this way to take advantage of the draggability
  of markers and the trigger when source data changes. If I knew how to have marker changes get picked up by map.on('sourcedata')
  */

  var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    marker: false,
    mapboxgl: mapboxgl
    });
  map.addControl(geocoder);

  map.addSource("sourceToBeEdited", {
    type: 'geojson',
    data: {
    "type": "FeatureCollection",
    "sourceId": "startPoint",
    "features": []
    }
  })

  const startButton = document.querySelector('#startPointButton');
  const endButton = document.querySelector('#endPointButton');
  const updateStartPoint = () => {map.getSource("sourceToBeEdited").setData({
    "type": "FeatureCollection",
    "sourceId": "startPoint",
    "features": []
    })}
  const updateEndPoint = () => {map.getSource("sourceToBeEdited").setData({
    "type": "FeatureCollection",
    "sourceId": "endPoint",
    "features": []
    })}
  startButton.addEventListener('click', updateStartPoint);
  endButton.addEventListener('click', updateEndPoint);

  map.addSource("routes", {
    type: 'geojson',
    data: {
    "type": "FeatureCollection",
    "features": []
    }
  })

  map.addLayer({
    'id': "routes-layer",
    'type': 'line',
    'source': "routes",
    'layout': {},
    'paint': {
      'line-color': '#888',
      'line-width': 8
      }
    });

  map.addLayer({
    'id': "selected-routes-layer",
    'type': 'line',
    'source': "routes",
    'layout': {},
    'paint': {
      'line-color': 'yellow',
      'line-width': 12
      }
    });


map.on('click', function(e) {
  // The event object (e) contains information like the
  // coordinates of the point on the map that was clicked.
  console.log('A click event has occurred at ' + e.lngLat, e,  );

  const sourceId = map.getSource("sourceToBeEdited")._data.sourceId;

  console.log('A click event has occurred at ' + e.lngLat, e,  map.getSource(sourceId));
  if (!map.getSource(sourceId)) { createMarker(sourceId == "startPoint"? "green" : "red",  e.lngLat, map, sourceId) }
    
  // Would like to do something where clicking the maps selects a line. Went into rabbit hole here a bit. Couldn't find a simple/time efficient way
  
  });

  // TODO Add draggable point
  // TODO Add a geocoder
  // TODO Add results to map
  // TODO Calculate routes
  // TODO Add animation function
  // TODO Add functions for querying POI
});

map.on("sourcedata", async (e) => {
  console.log("data was updated which", e.sourceCacheId);
  if (e.sourceCacheId == "other:startPoint" || e.sourceCacheId == "other:endPoint") { // otherwise we get endless looping
    console.log("data was updated", e, map.getSource("startPoint"), map.getSource("endPoint"));
    const routesDriving = await createRoute(
      map.getSource("startPoint")._data.features[0].geometry.coordinates,
      map.getSource("endPoint")._data.features[0].geometry.coordinates,
      "driving"
      )

    const routesDrivingTraffic = await createRoute(
      map.getSource("startPoint")._data.features[0].geometry.coordinates,
      map.getSource("endPoint")._data.features[0].geometry.coordinates,
      "driving-traffic"
      )
    
    console.log("routes", routesDriving);
    //const routes = routesDriving.routes.map(route => Object.assign({type: "driving"}, route)) + routesDrivingTraffic.routes.map(route => Object.assign({type: "driving-traffic"}, route))
    
    const argMinReducer = (accumulator, currentValue) => accumulator.duration < currentValue.duration? accumulator : currentValue;


    const bestRouteDrivingTime = routesDriving.routes.reduce(argMinReducer)
    const bestRouteDrivingTimeWithTraffic = routesDrivingTraffic.routes.reduce(argMinReducer)
 
    console.log("best", bestRouteDrivingTime, bestRouteDrivingTimeWithTraffic)

    const routes = [Object.assign({type: "driving"}, bestRouteDrivingTime), Object.assign({type: "driving-traffic"}, bestRouteDrivingTimeWithTraffic)]
    console.log("routes", routes);
    //const durations = routes.map(route => route.duration)
    map.getSource("routes").setData({
      "type": "FeatureCollection",
      "features": routes
      })

    const timeCopy = seconds => new Date(seconds * 1000).toISOString().substr(11, 8) + " (HH:MM:SS)"// https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript

    document.getElementById("route-selection").innerHTML = "<p><b>Results</b></p><p>Best driving time without traffic: " + 
    timeCopy(bestRouteDrivingTime.duration) +
    "<input type='button' id='best-without-traffic' value='Follow'/>" +
    "<p>Best driving time <i>with</i> traffic: " +
    timeCopy(bestRouteDrivingTimeWithTraffic.duration) +
    "<input type='button' id='best-with-traffic' value='Follow'/>" +
    "</p>" 

    const routeWithoutTrafficButton = document.querySelector('#best-without-traffic');
    const routeWithTrafficButton = document.querySelector('#best-with-traffic');
    
    routeWithoutTrafficButton.addEventListener('click', () => runAnimation(map, bestRouteDrivingTime.geometry.coordinates));
    routeWithTrafficButton.addEventListener('click', () => runAnimation(map, bestRouteDrivingTimeWithTraffic.geometry.coordinates));

    const runAnimation = (map, targetRoute, cameraRoute) => {
      var line = turf.lineString(targetRoute);
      var offsetLine = turf.lineOffset(line, 0.1, {units: 'miles'});
      console.log("offset", offsetLine)

      var cameraRoute = offsetLine.geometry.coordinates

      var animationDuration = 80000;
      var cameraAltitude = 4000;
      // get the overall distance of each route so we can interpolate along them
      var routeDistance = turf.lineDistance(turf.lineString(targetRoute));
      var cameraRouteDistance = turf.lineDistance(
      turf.lineString(cameraRoute)
      );
      
      var start;
      
      function frame(time) {
      if (!start) start = time;
      // phase determines how far through the animation we are
      var phase = (time - start) / animationDuration;
      
      // phase is normalized between 0 and 1
      // when the animation is finished, reset start to loop the animation
      if (phase > 1) {
      // wait 1.5 seconds before looping
      setTimeout(function () {
      start = 0.0;
      }, 1500);
      }
      
      // use the phase to get a point that is the appropriate distance along the route
      // this approach syncs the camera and route positions ensuring they move
      // at roughly equal rates even if they don't contain the same number of points
      var alongRoute = turf.along(
      turf.lineString(targetRoute),
      routeDistance * phase
      ).geometry.coordinates;
      
      var alongCamera = turf.along(
      turf.lineString(cameraRoute),
      cameraRouteDistance * phase
      ).geometry.coordinates;
      
      var camera = map.getFreeCameraOptions();
      
      // set the position and altitude of the camera
      camera.position = mapboxgl.MercatorCoordinate.fromLngLat(
      {
      lng: alongCamera[0],
      lat: alongCamera[1]
      },
      cameraAltitude
      );
      
      // tell the camera to look at a point along the route
      camera.lookAtPoint({
      lng: alongRoute[0],
      lat: alongRoute[1]
      });
      
      map.setFreeCameraOptions(camera);
      
      window.requestAnimationFrame(frame);
      }
      
      window.requestAnimationFrame(frame)
    }

  }
})
