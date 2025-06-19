
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MAPBOX_TOKEN = "pk.eyJ1IjoibWljaGhlbHRpbmdmeSIsImEiOiJjbWMybG90NW4wOW51MnJvZzhtbjV2a2VmIn0.ChuSb3DlCEXTjlaW1tC-FA";

const dailyLocation = [
  { lat: 48.8584, lon: 2.2945, name: "paris" }, // Eiffel Tower
  { lat: 40.6892, lon: -74.0445, name: "new york" }, // Statue of Liberty
  { lat: 35.6586, lon: 139.7454, name: "tokyo" }, // Tokyo Tower
];

function getTodayLocation() {
  const today = new Date();
  const index = today.getFullYear() + today.getMonth() + today.getDate();
  return dailyLocation[index % dailyLocation.length];
}

export default function Zoomle() {
  const today = new Date().toISOString().split("T")[0];
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState("");
  const { lat, lon, name } = getTodayLocation();
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon},${lat},15,0/500x300?access_token=${MAPBOX_TOKEN}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === name.toLowerCase()) {
      setResult("🎉 Correct!");
    } else {
      setResult("❌ Try again!");
    }
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Zoomle - {today}</h2>
      <img src={mapUrl} alt="Daily Location" className="mx-auto rounded shadow mb-4" />
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          placeholder="Guess the location"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          className="border rounded px-4 py-2 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Guess</button>
      </form>
      {result && <p className="text-lg font-semibold">{result}</p>}
      <div className="mt-6">
        <Link to="/emovi" className="text-blue-500 underline">Play Emovi →</Link>
      </div>
    </div>
  );
}
