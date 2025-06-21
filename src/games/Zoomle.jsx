import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import countries from "../data/countries_with_mapLocations.json";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAX_ZOOM = 22;
const INITIAL_ZOOM = 18;
const MAPBOX_SIZE = "1280x960";
const MAPBOX_RETINA = "@2x";
const DISPLAY_WIDTH = 640;
const DISPLAY_HEIGHT = 480;

// Utility functions
function getDailyCountry(offset = 0) {
  // Deterministic "country of the day", optionally offset for dev
  const today = new Date().toISOString().split("T")[0];
  const hash = today.split("-").reduce((acc, v) => acc + parseInt(v), 0) + offset;
  return countries.length > 0 ? countries[(hash % countries.length + countries.length) % countries.length] : null;
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
  const dLon = toLon - fromLon;
  const y = Math.sin(dLon * Math.PI / 180) * Math.cos(toLat * Math.PI / 180);
  const x = Math.cos(fromLat * Math.PI / 180) * Math.sin(toLat * Math.PI / 180) -
            Math.sin(fromLat * Math.PI / 180) * Math.cos(toLat * Math.PI / 180) * Math.cos(dLon * Math.PI / 180);
  const brng = Math.atan2(y, x) * 180 / Math.PI;
  const compass = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const idx = Math.round(((brng + 360) % 360) / 45) % 8;
  return compass[idx];
}
const directionToArrow = {
  N: '↑', NE: '↗', E: '→', SE: '↘', S: '↓', SW: '↙', W: '←', NW: '↖'
};

export default function Zoomle() {
  const today = new Date().toISOString().split("T")[0];
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [availableZooms, setAvailableZooms] = useState([INITIAL_ZOOM]);
  const [countryOffset, setCountryOffset] = useState(0); // For dev cycling
  const sliderRef = useRef(null);
  const [error, setError] = useState("");

  // Get today's country, with dev offset
  const correctAnswer = getDailyCountry(countryOffset);
  const gameOver = guesses.length >= 6 || guesses.some(g => g.name === (correctAnswer && correctAnswer.name));

  // Map URL construction
  const mapUrl =
    MAPBOX_TOKEN && correctAnswer && correctAnswer.mapLocations && correctAnswer.mapLocations[0]
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${correctAnswer.mapLocations[0].lon},${correctAnswer.mapLocations[0].lat},${zoom},0/${MAPBOX_SIZE}${MAPBOX_RETINA}?access_token=${MAPBOX_TOKEN}`
      : "";

  // Handle missing token or country data
  useEffect(() => {
    if (!MAPBOX_TOKEN) setError("Mapbox token is missing. Please add VITE_MAPBOX_TOKEN to your .env file.");
    else if (!correctAnswer || !correctAnswer.mapLocations || correctAnswer.mapLocations.length === 0)
      setError("Country data is missing or invalid. Please check your countries_with_mapLocations.json file.");
    else setError("");
  }, [correctAnswer]);

  // Update available zooms when guesses change
  useEffect(() => {
    if (guesses.length > 0) {
      const newZooms = [INITIAL_ZOOM];
      for (let i = 1; i <= guesses.length; i++) {
        newZooms.push(Math.max(4, INITIAL_ZOOM - i));
      }
      setAvailableZooms(newZooms);
    } else {
      setAvailableZooms([INITIAL_ZOOM]);
    }
  }, [guesses.length]);

  const handleSliderChange = (e) => {
    const index = parseInt(e.target.value, 10);
    setZoom(availableZooms[index]);
  };

  // Only show countries whose names START with the input (case-insensitive)
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setFiltered(
      val.length > 0 
        ? countries.filter(c => 
            c.name.toLowerCase().startsWith(val.toLowerCase())
          )
        : []
    );
  };

  const handleSelect = (name) => {
    const country = countries.find(c => c.name === name);
    if (!country || !country.mapLocations || country.mapLocations.length === 0) return;
    if (!correctAnswer || !correctAnswer.mapLocations || correctAnswer.mapLocations.length === 0) return;

    const selected = {
      name: country.name,
      lat: country.mapLocations[0].lat,
      lon: country.mapLocations[0].lon
    };
    const answerLoc = correctAnswer.mapLocations[0];

    const distance = Math.round(getDistance(
      selected.lat,
      selected.lon,
      answerLoc.lat,
      answerLoc.lon
    ));
    const direction = getDirection(
      selected.lat,
      selected.lon,
      answerLoc.lat,
      answerLoc.lon
    );
    const isCorrect = selected.name === correctAnswer.name;

    setGuesses(prev => [...prev, {
      name: selected.name,
      distance,
      direction,
      isCorrect
    }]);
    setInput("");
    setFiltered([]);
    setZoom(prevZoom => Math.max(4, prevZoom - 1)); // Zoom out by 1
  };

  // Enter selects the first dropdown option, if available
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault(); // Prevent form submit or accidental newline
      handleSelect(filtered[0].name);
    }
  };

  // Dev button handler: cycle to next daily guess and reset state
  const handleDevNext = () => {
    setCountryOffset((offset) => offset + 1);
    setGuesses([]);
    setInput("");
    setFiltered([]);
    setZoom(INITIAL_ZOOM);
    setAvailableZooms([INITIAL_ZOOM]);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-neutral-100">
        <div>
          <h1 className="text-2xl font-bold mb-4">Zoomle Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col items-center justify-start p-6 font-serif">
      {/* DEV BUTTON */}
      <button
        onClick={handleDevNext}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          background: "#EEE",
          border: "1px solid #CCC",
          borderRadius: 4,
          padding: "4px 10px",
          fontWeight: "bold",
          cursor: "pointer",
          zIndex: 1000
        }}
        title="Next daily guess (Dev only)"
      >
        Dev: Next
      </button>

      <h1 className="text-3xl font-bold mb-2">Zoomle - {today}</h1>
      <p className="mb-4 text-sm text-gray-600">Guess the daily country from the satellite map!</p>

      {/* Map */}
      <div className="map-container mb-4" style={{ width: DISPLAY_WIDTH, height: DISPLAY_HEIGHT }}>
        {mapUrl ? (
          <img
            src={mapUrl}
            alt="Map"
            width={DISPLAY_WIDTH}
            height={DISPLAY_HEIGHT}
            className="rounded shadow"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
            Map unavailable
          </div>
        )}
      </div>

      {/* Zoom Slider - improved UX */}
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span role="img" aria-label="Zoomed In" title="Zoomed In">🔍+</span>
          <span>Zoom</span>
          <span role="img" aria-label="Zoomed Out" title="Zoomed Out">🔍-</span>
        </div>
        <div className="relative">
          <input
            type="range"
            ref={sliderRef}
            min="0"
            max={availableZooms.length - 1}
            value={availableZooms.indexOf(zoom)}
            onChange={handleSliderChange}
            disabled={availableZooms.length <= 1}
            aria-label="Zoom level"
            className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${availableZooms.length <= 1 ? 'bg-gray-300' : 'bg-blue-500'}`}
            style={{
              backgroundSize: `${availableZooms.length > 1 ? (100 * ((availableZooms.indexOf(zoom)) / (availableZooms.length - 1))) : 0}% 100%`
            }}
          />
          {/* Tick marks */}
          <div className="absolute left-0 right-0 top-4 flex justify-between pointer-events-none select-none">
            {availableZooms.map((z, idx) => (
              <div key={z} className="flex flex-col items-center w-1">
                <div
                  style={{
                    width: 2,
                    height: 8,
                    background: zoom === z ? "#2563eb" : "#cbd5e1",
                    marginBottom: 2,
                    borderRadius: 2
                  }}
                />
                <div className="text-[10px] text-gray-500">
                  {z}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-center text-sm text-gray-700 mt-1">
          {availableZooms.length > 1
            ? (
                <>
                  Zoom Level: <span className="font-bold">{zoom}</span> ({availableZooms.indexOf(zoom) + 1}/{availableZooms.length})
                </>
              )
            : (
              <span title="Make your first guess to unlock zoom control">
                Make your first guess to unlock zoom control
              </span>
            )
          }
        </div>
      </div>

      {/* Guess Input */}
      {!gameOver && (
        <div className="mb-4 w-full max-w-sm relative">
          <input
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Guess a country..."
            autoComplete="off"
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

      {/* Guess List */}
      <ul className="mb-6 w-full max-w-sm">
        {guesses.map((g, i) => (
          <li key={i} className={`p-2 border rounded mb-2 flex items-center justify-between ${g.isCorrect ? "bg-green-100 border-green-400" : ""}`}>
            <span>
              <strong>{g.name}</strong>
            </span>
            <span>
              {g.isCorrect ? "🎉 Correct!" : `${g.distance} km ${directionToArrow[g.direction] || ''}`}
            </span>
          </li>
        ))}
      </ul>

      {/* Result */}
      {gameOver && !guesses.some(g => g.isCorrect) && (
        <div className="text-red-500 font-semibold mb-4">
          The correct answer was: {correctAnswer ? correctAnswer.name : "?"}
        </div>
      )}

      {/* Navigation */}
      <Link to="/" className="text-blue-500 hover:underline mt-2 text-sm">Back to Home</Link>
    </div>
  );
}
