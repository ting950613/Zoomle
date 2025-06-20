import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import countries from "./countries.json";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;


function getDailyCountry() {
  const seed = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  return countries[seed % countries.length];
}
const correctAnswer = getDailyCountry();


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
  const angle = Math.atan2(toLon - fromLon, toLat - fromLat) * 180 / Math.PI;
  const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
  const index = Math.round(((angle + 360) % 360) / 45) % 8;
  return directions[index];
}

export default function Zoomle() {
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoom, setZoom] = useState(12);

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
          <input onKeyDown={handleKeyDown}
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
          <li key={i} className={`p-2 border rounded mb-2 ${g.isCorrect ? "bg-green-100" : "bg-white"}`}>
            <strong>{g.name}</strong> – {g.isCorrect ? (
  "🎉 Correct!"
) : (
  <>
    {`${g.distance} km`}
    <img src={`/arrows/${g.direction}.svg`} alt={g.direction} className="inline w-5 h-5 ml-2" />
  </>
)}</li>
        ))}
      </ul>

      {gameOver && !guesses.some(g => g.isCorrect) && (
        <div className="text-red-500 font-semibold mb-4">The correct answer was: {correctAnswer.name}</div>
      )}

      <Link to="/emovi" className="text-blue-500 underline">Play Emovi →</Link>
    {gameOver && !guesses.some(g => g.isCorrect) && (
        <div className="mt-2 text-red-600">The correct answer was: {correctAnswer.name}</div>
      )}
      {gameOver && (
        <div className="mt-1 text-sm text-gray-500">{guesses.length}/6 guesses used</div>
      )}
    </div>
  );
}