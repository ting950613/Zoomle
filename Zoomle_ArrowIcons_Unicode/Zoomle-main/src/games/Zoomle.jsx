
const directionToArrow = {
  N: '↑',
  NE: '↗',
  E: '→',
  SE: '↘',
  S: '↓',
  SW: '↙',
  W: '←',
  NW: '↖'
};

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import countries from "./countries.json";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const correctAnswer = {
  name: "Japan",
  lat: 36.2048,
  lon: 138.2529,
};

function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = deg => deg * Math.PI / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirection(fromLat, fromLon, toLat, toLon) {
  const dLon = toLon - fromLon;
  const y = Math.sin(dLon * Math.PI / 180) * Math.cos(toLat * Math.PI / 180);
  const x = Math.cos(fromLat * Math.PI / 180) * Math.sin(toLat * Math.PI / 180) -
            Math.sin(fromLat * Math.PI / 180) * Math.cos(toLat * Math.PI / 180) * Math.cos(dLon * Math.PI / 180);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  const compass = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(((brng + 360) % 360) / 45) % 8;
  return compass[idx];
}

export default function Zoomle() {
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoom, setZoom] = useState(8);

  const today = new Date().toISOString().split("T")[0];
  const gameOver = guesses.length >= 6 || guesses.some(g => g.name === correctAnswer.name);

  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${correctAnswer.lon},${correctAnswer.lat},${zoom},0/500x300?access_token=${MAPBOX_TOKEN}`;

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 0) {
      setFiltered(
        countries.filter(c => c.name.toLowerCase().includes(val.toLowerCase())).slice(0, 10)
      );
    } else {
      setFiltered([]);
    }
  };

  const handleSelect = (name) => {
    const selected = countries.find(c => c.name === name);
    if (!selected) return;

    const distance = Math.round(getDistance(selected.lat, selected.lon, correctAnswer.lat, correctAnswer.lon));
    const direction = getDirection(selected.lat, selected.lon, correctAnswer.lat, correctAnswer.lon);
    const isCorrect = selected.name === correctAnswer.name;

    setGuesses(prev => [...prev, { name: selected.name, distance, direction, isCorrect }]);
    setInput("");
    setFiltered([]);
    setZoom(z => Math.max(2, z - 1));
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col items-center justify-start p-6 font-serif">
      <h1 className="text-3xl font-bold mb-2">Zoomle - {today}</h1>
      <p className="mb-4 text-sm text-gray-600">Daily Location Guessing Game</p>
      <img src={mapUrl} alt="Map" className="mb-4 rounded shadow" />

      {!gameOver && (
        <div className="mb-4 w-full max-w-sm relative">
          <input
            value={input}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Guess a country..."
          />
          {filtered.length > 0 && (
            <ul className="absolute bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto z-10 rounded shadow">
              {filtered.map(c => (
                <li
                  key={c.name}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelect(c.name)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ul className="mb-6 w-full max-w-sm">
        {guesses.map((g, i) => (
          <li key={i} className={`p-2 border rounded mb-2 ${g.isCorrect ? "🎉 Correct!" : `${g.distance} km ${directionToArrow[g.direction] || ''}`}`}>
            <strong>{g.name}</strong> – g.isCorrect ? "🎉 Correct!" : (<>{`${g.distance} km`} <img src={`/arrows/$.svg`} alt= className="inline w-5 h-5 ml-2" /></>)
            <img src={`/arrows/$.svg`} alt= className="inline w-5 h-5 ml-2" />
          </li>
        ))}
      </ul>

      {gameOver && !guesses.some(g => g.isCorrect) && (
        <div className="text-red-500 font-semibold mb-4">The correct answer was: {correctAnswer.name}</div>
      )}

      <Link to="/emovi" className="text-blue-500 underline">Play Emovi →</Link>
    </div>
  );
}