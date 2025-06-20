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

// Daily country selector based on local date
function getTodayCountry() {
  const today = new Date().toLocaleDateString("en-CA");
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  return countries[Math.abs(hash) % countries.length];
}

const correctAnswer = getTodayCountry();

// Distance in km
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Bearing → compass
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

  const gameOver = guesses.length >= 6 || guesses.some((g) => g.isCorrect);

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

  const handleSelect = (name) => {
    const guess = countries.find((c) => c.name === name);
    if (!guess) return;

    const distance = Math.round(
      getDistance(guess.lat, guess.lon, correctAnswer.lat, correctAnswer.lon)
    );
    const direction = getDirection(
      guess.lat,
      guess.lon,
      correctAnswer.lat,
      correctAnswer.lon
    );
    const isCorrect = guess.name === correctAnswer.name;

    setGuesses([...guesses, { name, distance, direction, isCorrect }]);
    setInput("");
    setFiltered([]);
    if (!isCorrect) setZoom((z) => Math.min(z + 1, 10));
  };

  return (
    <div className="p-4 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-2">🌍 Zoomle</h1>
      <p className="mb-4 text-sm text-gray-600">Guess the country based on the satellite image</p>

      {!gameOver && (
        <>
          <input
            type="text"
            className="border p-2 w-full rounded"
            placeholder="Type a country"
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && filtered.length > 0) {
                handleSelect(filtered[0].name);
              }
            }}
          />
          <ul className="text-left border rounded mt-1">
            {filtered.map((c) => (
              <li
                key={c.name}
                onClick={() => handleSelect(c.name)}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
              >
                {c.name}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="my-4">
        <img
          src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${correctAnswer.lon},${correctAnswer.lat},${zoom},0/400x300?access_token=pk.eyJ1IjoibWljaGhlbHRpbmdmeSIsImEiOiJjbWMybG90NW4wOW51MnJvZzhtbjV2a2VmIn0.ChuSb3DlCEXTjlaW1tC-FA`}
          alt="map"
          className="rounded mx-auto"
        />
      </div>

      <div className="text-sm text-gray-500 mb-2">{`${guesses.length}/6 guesses`}</div>
      <ul className="text-left text-sm space-y-1">
        {guesses.map((g, i) => (
          <li key={i}>
            <span className="font-medium">{g.name}</span> — {g.distance} km {arrowMap[g.direction] || g.direction}
            {g.isCorrect && " ✅"}
          </li>
        ))}
      </ul>

      {gameOver && !guesses.some((g) => g.isCorrect) && (
        <div className="mt-4 text-red-600 font-semibold">
          The correct answer was: {correctAnswer.name}.
        </div>
      )}

      <div className="mt-6">
        <Link to="/" className="text-blue-600 underline text-sm">
          ← Back to menu
        </Link>
      </div>
    </div>
  );
}
