
import React, { useEffect, useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import countries from "../data/countries.json";
import "./Zoomle.css";

mapboxgl.accessToken = "pk.eyJ1IjoibWljaGhlbHRpbmdmeSIsImEiOiJjbWMybG90NW4wOW51MnJvZzhtbjV2a2VmIn0.ChuSb3DlCEXTjlaW1tC-FA";

const getDirectionArrow = (bearing) => {
  const directions = [
    { limit: 22.5, icon: "↑" },
    { limit: 67.5, icon: "↗" },
    { limit: 112.5, icon: "→" },
    { limit: 157.5, icon: "↘" },
    { limit: 202.5, icon: "↓" },
    { limit: 247.5, icon: "↙" },
    { limit: 292.5, icon: "←" },
    { limit: 337.5, icon: "↖" },
    { limit: 360, icon: "↑" },
  ];
  return directions.find(d => bearing < d.limit).icon;
};

const getDailyCountry = () => {
  const date = new Date();
  const seed = date.getUTCFullYear() * 1000 + date.getUTCMonth() * 100 + date.getUTCDate();
  const index = seed % countries.length;
  return countries[index];
};

const calculateDistanceAndBearing = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  const bearing = (brng + 360) % 360;

  return { distance: distance.toFixed(2), bearing };
};

const Zoomle = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [userGuess, setUserGuess] = useState("");
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [guesses, setGuesses] = useState([]);
  const [answer] = useState(getDailyCountry());
  const [gameOver, setGameOver] = useState(false);
  const [guessCount, setGuessCount] = useState(0);

  useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 1.2,
    });
  }, []);

  const handleGuess = (country) => {
    if (gameOver || guesses.find((g) => g.name === country.name)) return;

    const { distance, bearing } = calculateDistanceAndBearing(
      country.lat,
      country.lon,
      answer.lat,
      answer.lon
    );
    const direction = getDirectionArrow(bearing);
    const newGuess = { name: country.name, distance, direction };
    const updatedGuesses = [...guesses, newGuess];

    setGuesses(updatedGuesses);
    setGuessCount(updatedGuesses.length);
    setUserGuess("");
    setFilteredCountries([]);

    if (country.name === answer.name || updatedGuesses.length >= 6) {
      setGameOver(true);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setUserGuess(value);
    const filtered = countries.filter((c) =>
      c.name.toLowerCase().startsWith(value.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filteredCountries.length > 0) {
      handleGuess(filteredCountries[0]);
    }
  };

  return (
    <div className="zoomle-container">
      <div ref={mapContainer} className="map-container" />
      <div className="game-panel">
        <input
          type="text"
          value={userGuess}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter country"
        />
        <ul className="dropdown">
          {filteredCountries.map((country) => (
            <li
              key={country.name}
              onClick={() => handleGuess(country)}
              className="dropdown-item"
            >
              {country.name}
            </li>
          ))}
        </ul>
        <div className="guess-list">
          {guesses.map((g, index) => (
            <div key={index}>
              {index + 1}/6 - {g.name} - {g.distance} km - {g.direction}
            </div>
          ))}
        </div>
        {gameOver && (
          <div className="result">
            {guesses.some((g) => g.name === answer.name)
              ? "🎉 Correct!"
              : `❌ The correct answer was: ${answer.name}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default Zoomle;
