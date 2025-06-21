import React, { useState } from "react";
import { Link } from "react-router-dom";
import countries from "../data/countries_with_mapLocations.json";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAX_ZOOM = 22; // Maximum zoom level supported by Mapbox
const INITIAL_ZOOM = 18; // Start more zoomed in (was 12)

function getDailyCountry() {
  const seed = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  const country = countries[seed % countries.length];
  return {
    name: country.name,
    locationName: country.mapLocations[0].name,
    lat: country.mapLocations[0].lat,
    lon: country.mapLocations[0].lon
  };
}

function getRandomCountry() {
  const country = countries[Math.floor(Math.random() * countries.length)];
  const randomLocation = country.mapLocations[Math.floor(Math.random() * country.mapLocations.length)];
  return {
    name: country.name,
    locationName: randomLocation.name,
    lat: randomLocation.lat,
    lon: randomLocation.lon
  };
}

// ... (keep your existing getDistance and getDirection functions)

export default function Zoomle() {
  // ... (previous state declarations)
  const [zoom, setZoom] = useState(INITIAL_ZOOM); // Start at higher zoom

  // ... (other existing code)

  const handleSelect = (name) => {
    const country = countries.find(c => c.name === name);
    if (!country) return;

    const selected = {
      name: country.name,
      lat: country.mapLocations[0].lat,
      lon: country.mapLocations[0].lon
    };

    const distance = Math.round(getDistance(selected.lat, selected.lon, correctAnswer.lat, correctAnswer.lon));
    const direction = getDirection(selected.lat, selected.lon, correctAnswer.lat, correctAnswer.lon);
    const isCorrect = selected.name === correctAnswer.name;

    setGuesses(prev => [...prev, { 
      name: selected.name, 
      distance, 
      direction, 
      isCorrect 
    }]);
    setInput("");
    setFiltered([]);
    setZoom(z => Math.max(4, z - 2)); // Don't zoom out below level 4
  };

  // ... (rest of your component code)

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col items-center justify-start p-6 font-serif">
      {/* ... (previous JSX) */}
      <img 
        src={mapUrl} 
        alt="Map" 
        className="mb-4 rounded shadow"
        title={`Zoom level: ${zoom}`} // Show zoom level on hover
      />
      {/* ... (rest of JSX) */}
    </div>
  );
}
