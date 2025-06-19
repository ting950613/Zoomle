
import React, { useState } from "react";
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

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 0) {
      setFiltered(countries.filter(c => c.toLowerCase().includes(val.toLowerCase())));
    } else {
      setFiltered([]);
    }
  };

  const handleSelect = (country) => {
    const lat = 0;  // Placeholder for actual country lat
    const lon = 0;  // Placeholder for actual country lon

    const dist = getDistance(lat, lon, correctAnswer.lat, correctAnswer.lon).toFixed(0);
    const dir = getDirection(lat, lon, correctAnswer.lat, correctAnswer.lon);

    setGuesses(prev => [...prev, { country, dist, dir }]);
    setInput("");
    setFiltered([]);
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zoomle</h1>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        className="border px-3 py-2 w-full mb-2"
        placeholder="Guess a country..."
      />
      {filtered.length > 0 && (
        <ul className="border max-h-48 overflow-y-auto bg-white shadow mb-2">
          {filtered.map((c, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(c)}
            >
              {c}
            </li>
          ))}
        </ul>
      )}
      <div>
        {guesses.map((guess, i) => (
          <div key={i} className="flex items-center gap-3 py-1">
            <span className="w-32">{guess.country}</span>
            <span>{guess.dist} km</span>
            <img src={`/arrows/${guess.dir}.svg`} alt={guess.dir} className="w-6 h-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
