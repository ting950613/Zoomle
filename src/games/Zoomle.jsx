import React, { useState } from "react";
import { Link } from "react-router-dom";
import countries from "../data/countries_with_mapLocations.json";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function getDailyCountry() {
  const seed = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
  const country = countries[seed % countries.length];
  // Use the first mapLocation (usually the capital) by default
  return {
    name: country.name,
    locationName: country.mapLocations[0].name,
    lat: country.mapLocations[0].lat,
    lon: country.mapLocations[0].lon
  };
}

function getRandomCountry() {
  const country = countries[Math.floor(Math.random() * countries.length)];
  // Randomly select one of the mapLocations
  const randomLocation = country.mapLocations[Math.floor(Math.random() * country.mapLocations.length)];
  return {
    name: country.name,
    locationName: randomLocation.name,
    lat: randomLocation.lat,
    lon: randomLocation.lon
  };
}

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
  const today = new Date().toISOString().split("T")[0];
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoom, setZoom] = useState(12); // Changed from 16 to 12 for better initial view
  const [devCountry, setDevCountry] = useState(null);

  // Use daily country unless devCountry is set (testing mode)
  const correctAnswer = devCountry || getDailyCountry();

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
    const country = countries.find(c => c.name === name);
    if (!country) return;

    // Use the first mapLocation (capital) by default
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
    setZoom(z => Math.max(2, z - 2)); // Zoom out faster with -2 instead of -1
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSelect(input);
    }
  };

  // TESTING BUTTON: set a random country as the answer for development
  const handleRandomCountry = () => {
    setGuesses([]);
    setZoom(12); // Reset to wider zoom
    setDevCountry(getRandomCountry());
  };

  // DAILY RESET: revert to daily mode and reload guesses/zoom
  const handleDailyReset = () => {
    setGuesses([]);
    setZoom(12); // Reset to wider zoom
    setDevCountry(null);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col items-center justify-start p-6 font-serif">
      <h1 className="text-3xl font-bold mb-2">Zoomle - {today}</h1>
      
      {/* DEV ONLY BUTTONS */}
      <div className="flex flex-row gap-2 mb-4">
        <button
          onClick={handleRandomCountry}
          className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Random Country (Dev)
        </button>
        <button
          onClick={handleDailyReset}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Daily Refresh
        </button>
      </div>
      
      <p className="mb-4 text-sm text-gray-600">Daily Location Guessing Game</p>
      <img src={mapUrl} alt="Map" className="mb-4 rounded shadow" />
      <p className="text-sm text-gray-500 mb-2">{correctAnswer.locationName || correctAnswer.name}</p>

      {!gameOver && (
        <div className="mb-4 w-full max-w-sm relative">
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
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
                {`${g.distance} km `}
                <span className="text-xl">{g.direction}</span>
              </>
            )}
          </li>
        ))}
      </ul>

      <p className="text-gray-700 mb-2">{guesses.length}/6 guesses</p>

      {gameOver && !guesses.some(g => g.isCorrect) && (
        <p className="text-red-500 text-sm mb-4">
          The correct answer was: <strong>{correctAnswer.name}</strong> ({correctAnswer.locationName}).
        </p>
      )}

      <Link to="/" className="text-blue-500 hover:underline mt-2 text-sm">Back to Home</Link>
    </div>
  );
}
