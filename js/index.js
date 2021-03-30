const mapboxgl = require('mapbox-gl');

mapboxgl.accessToken =
  'pk.eyJ1IjoibWJ4c29sdXRpb25zIiwiYSI6ImNqeWhpandmazAyYmYzYnBtZzJxM3hlM2EifQ.ZLKIqBxG97_HklFj0_1RBQ';

const map = new mapboxgl.Map({
  container: 'map', // container id
  // TODO Add a custom style
  style: 'mapbox://styles/mapbox/streets-v11', // style URL
  // TODO Localize the map to the user's location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});

map.on('load', () => {
  // TODO Add Source
  var marker = new mapboxgl.Marker()
    .setLngLat([-74.5, 40])
    .addTo(map);
  // TODO Add layers for lines
  // TODO Add draggable point
  // TODO Add a geocoder
  // TODO Add results to map
  // TODO Calculate routes
  // TODO Add animation function
  // TODO Add functions for querying POI
});
