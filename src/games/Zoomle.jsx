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

// ... (keep all your existing utility functions: getDailyCountry, getRandomCountry, getDistance, getDirection)

export default function Zoomle() {
  const today = new Date().toISOString().split("T")[0];
  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [devCountry, setDevCountry] = useState(null);
  const [availableZooms, setAvailableZooms] = useState([INITIAL_ZOOM]);
  const sliderRef = useRef(null);

  const correctAnswer = devCountry || getDailyCountry();
  const gameOver = guesses.length >= 6 || guesses.some(g => g.name === correctAnswer.name);

  const mapUrl = correctAnswer.lat && correctAnswer.lon 
    ? `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${correctAnswer.lon},${correctAnswer.lat},${zoom},0/${MAPBOX_SIZE}${MAPBOX_RETINA}?access_token=${MAPBOX_TOKEN}`
    : '';

  // Update available zooms when guesses change
  useEffect(() => {
    if (guesses.length > 0) {
      const newZooms = [INITIAL_ZOOM];
      for (let i = 1; i <= guesses.length; i++) {
        newZooms.push(INITIAL_ZOOM - i);
      }
      setAvailableZooms(newZooms);
    }
  }, [guesses.length]);

  const handleSliderChange = (e) => {
    const index = parseInt(e.target.value);
    setZoom(availableZooms[index]);
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    setFiltered(
      val.length > 0 
        ? countries.filter(c => 
            c.name.toLowerCase().includes(val.toLowerCase())
          ).slice(0, 10)
        : []
    );
  };

  const handleSelect = (name) => {
    const country = countries.find(c => c.name === name);
    if (!country || !country.mapLocations || country.mapLocations.length === 0) return;

    const selected = {
      name: country.name,
      lat: country.mapLocations[0].lat,
      lon: country.mapLocations[0].lon
    };

    const distance = Math.round(getDistance(
      selected.lat, 
      selected.lon, 
      correctAnswer.lat, 
      correctAnswer.lon
    ));
    const direction = getDirection(
      selected.lat, 
      selected.lon, 
      correctAnswer.lat, 
      correctAnswer.lon
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

  // ... (keep all your other handlers: handleKeyDown, handleRandomCountry, handleDailyReset)

  return (
    <div className="min-h-screen bg-neutral-100 text-gray-900 flex flex-col items-center justify-start p-6 font-serif">
      <h1 className="text-3xl font-bold mb-2">Zoomle - {today}</h1>
      
      {/* ... (keep your existing buttons and headers) */}

      {/* Zoom Slider */}
      <div className="w-full max-w-md mb-4">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Most Zoomed In</span>
          <span>Most Zoomed Out</span>
        </div>
        <input
          type="range"
          ref={sliderRef}
          min="0"
          max={availableZooms.length - 1}
          value={availableZooms.indexOf(zoom)}
          onChange={handleSliderChange}
          disabled={availableZooms.length <= 1}
          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${availableZooms.length <= 1 ? 'bg-gray-300' : 'bg-blue-500'}`}
        />
        <div className="text-center text-sm text-gray-700 mt-1">
          {availableZooms.length > 1 ? (
            `Zoom Level: ${zoom} (${availableZooms.indexOf(zoom) + 1}/${availableZooms.length})`
          ) : (
            "Make your first guess to unlock zoom control"
          )}
        </div>
      </div>

      {/* ... (keep your existing map image and game UI) */}

      {gameOver && !guesses.some(g => g.isCorrect) && (
        <p className="text-red-500 text-sm mb-4">
          The correct answer was: <strong>{correctAnswer.name}</strong> 
          {correctAnswer.locationName && ` (${correctAnswer.locationName})`}
        </p>
      )}

      <Link to="/" className="text-blue-500 hover:underline mt-2 text-sm">Back to Home</Link>
    </div>
  );
}
