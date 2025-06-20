import React, { useState } from "react";
import { Link } from "react-router-dom";
import countries from "./countries.json";

// Unicode arrow map
const arrowMap = {
  N:  "↑",
  NE: "↗",
  E:  "→",
  SE: "↘",
  S:  "↓",
  SW: "↙",
  W:  "←",
  NW: "↖",
};

// 1) Daily country selector (local midnight)
function getTodayCountry() {
  const today = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD" local
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  return countries[Math.abs(hash) % countries.length];
}

const correctAnswer = getTodayCountry();

// calculate distance
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// bearing → compass
function getDirection(fromLat, fromLon, toLat, toLon) {
  const dLon = toLon - fromLon;
  const y = Math.sin((dLon * Math.PI) / 180) * Math.cos((toLat * Math.PI) / 180);
  const x =
    Math.cos((fromLat * Math.PI) / 180) * Math.sin((toLat * Math.PI) / 180) -
    Math.sin((fromLat * Math.PI) / 180) *
      Math.cos((toLat * Math.PI) / 180) *
      Math.cos((dLon * Math.PI) / 180);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  const compass = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(((brng + 360) % 360) / 45) % 8;
  return compass[idx];
}

export default function Zoomle() {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [zoom, setZoom] = useState(4);

  // game over when 6 guesses or correct guessed
  const gameOver = guesses.length >= 6 || guesses.some((g) => g.isCorrect);

  // satellite map URL centered on today’s country
  const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${correctAnswer.lon},${correctAnswer.lat},${zoom},0/500x300?access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`;

  // filter dropdown as you type
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val) {
      setFiltered(
        countries
          .filter((c) =>
            c.name.toLowerCase().includes(val.toLowerCase())
          )
          .slice(0, 10)
      );
    } else {
      setFiltered([]);
    }
  };

  // click or Enter selects and submits
  const handleSelect = (name) => {
    const c = countries.find((c) => c.name === name);
    if (!c) return;
    const dist = Math.round(
      getDistance(c.lat, c.lon, correctAnswer.lat, correctAnswer.lon)
    );
    const dir = getDirection(
      c.lat,
      c.lon,
      correctAnswer.lat,
      correctAnswer.lon
    );
    const isCorrect = c.name === correctAnswer.name;
    setGuesses((g) => [...g, { name: c.name, distance: dist, direction: dir, isCorrect }]);
    setInput("");
    setFiltered([]);
    setZoom((z) => Math.max(2, z - 1));
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col items-center p-6 font-serif">
      <h1 className="text-3xl font-bold mb-1">Zoomle</h1>
      <p className="text-sm text-gray-600 mb-4">Daily Location Guessing Game</p>
      <img src={mapUrl} alt="Map" className="rounded shadow mb-4" />

      {!gameOver && (
        <div className="w-full max-w-sm mb-4 relative">
          <input
            className="w-full p-2 border rounded"
            placeholder="Guess a country…"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered.length) {
                handleSelect(filtered[0].name);
              }
            }}
          />
          {filtered.length > 0 && (
            <ul className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto rounded shadow z-10">
              {filtered.map((c) => (
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

      {/* Guess counter */}
      <div className="text-sm text-gray-600 mb-2">
        {guesses.length}/6 guesses
      </div>

      {/* Guess results with Unicode arrows */}
      <ul className="w-full max-w-sm mb-4">
        {guesses.map((g, i) => (
          <li
            key={i}
            className={`p-2 border rounded mb-2 ${
              g.isCorrect ? "bg-green-100" : "bg-white"
            }`}
          >
            <strong>{g.name}</strong> –{" "}
            {g.isCorrect ? "🎉 Correct!" : `${g.distance} km`}
            <span className="inline ml-2 text-xl">{arrowMap[g.direction]}</span>
          </li>
        ))}
      </ul>

      {/* Reveal if failed */}
      {gameOver && !guesses.some((g) => g.isCorrect) && (
        <div className="text-red-500 font-semibold mb-4">
          The correct answer was: {correctAnswer.name}.
        </div>
      )}

      <Link to="/emovi" className="text-blue-500 underline">
        Play Emovi →
      </Link>
    </div>
  );
}
