import React, { useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";
import './App.css';

const token = "pk.eyJ1IjoicGF0d2FyZHMiLCJhIjoiY2tmZzYwenZ4MDRvaDJxcTljc3EyNWxlYSJ9.cxQNQOhFMdUbgWSoaAPrng"

const Map2 = () => (<p>Hello</p>)

const styles = {
  width: "100vw",
  height: "calc(100vh - 80px)",
  position: "absolute"
};


const Map = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYnJpYW5iYW5jcm9mdCIsImEiOiJsVGVnMXFzIn0.7ldhVh3Ppsgv4lCYs65UdA";
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [0, 0],
        zoom: 5
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return <div ref={el => (mapContainer.current = el)} style={styles} />;
};

function App() {
  return (
    <Map/>
  );
}

export default App;
