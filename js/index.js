const mapboxgl = require('mapbox-gl');

mapboxgl.accessToken =
  'pk.eyJ1IjoibWJ4c29sdXRpb25zIiwiYSI6ImNqeWhpandmazAyYmYzYnBtZzJxM3hlM2EifQ.ZLKIqBxG97_HklFj0_1RBQ';

const createMarker = (color, coords) => {
  return new mapboxgl.Marker(
    {draggable: true, color}
  )
    .setLngLat(coords)
    .addTo(map);
}

async function createRoute(routeStartpoint, routeEndpoint) {
  const request_url = "https://api.mapbox.com/directions/v5/mapbox/driving-traffic/" + routeStartpoint[0] + "%2C" + routeStartpoint[1] + "%3B" + routeEndpoint[0] + "%2C" + routeEndpoint[1] + "?alternatives=true&geometries=geojson&steps=true&access_token=pk.eyJ1IjoicGF0d2FyZHMiLCJhIjoiY2tmZzYwenZ4MDRvaDJxcTljc3EyNWxlYSJ9.cxQNQOhFMdUbgWSoaAPrng"
  const response = await fetch(request_url)
  return await response.json()
}

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
  var src_marker = createMarker("green", [-74.5, 40])
  var snk_marker = createMarker("red", [-74.5, 40.1])

  map.addSource('endpoints', {
    type: 'geojson',
    data: {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [ -74.5, 40.05]
      }
    }]
    }
  })

  // Add a symbol layer
  map.addLayer({
    'id': 'endpoints',
    'type': 'circle',
    'source': 'endpoints',
    'layout': {},
    'paint': {
      'circle-radius': 6,
      'circle-color': '#B42222'
      },
    });

  var route = createRoute([-74.5, 40], [-74.5, 40.1])
  console.log(route)
  // TODO Add layers for lines
  // TODO Add draggable point
  // TODO Add a geocoder
  // TODO Add results to map
  // TODO Calculate routes
  // TODO Add animation function
  // TODO Add functions for querying POI
});
