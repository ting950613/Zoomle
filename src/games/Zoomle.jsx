import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./Zoomle.css";
import countries from "../data/countries_with_mapLocations.json";

mapboxgl.accessToken =
  "pk.eyJ1IjoibWljaGhlbHRpbmdmeSIsImEiOiJjbWMybG90NW4wOW51MnJvZzhtbjV2a2VmIn0.ChuSb3DlCEXTjlaW1tC-FA";

function getTodayCountryIndex() {
  const date = new Date();
  const dayNumber = Math.floor(
    date.setHours(0, 0, 0, 0) / (1000 * 60 * 60 * 24)
  );
  return dayNumber % countries.length;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    0.5 -
    Math.cos(dLat) / 2 +
    (Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      (1 - Math.cos(dLon))) /
      2;

  return Math.round(R * 2 * Math.asin(Math.sqrt(a)));
}

function getDirection(lat1, lon1, lat2, lon2) {
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const angle = (Math.atan2(dLon, dLat) * 180) / Math.PI;

  if (angle >= -22.5 && angle < 22.5) return "south";
  if (angle >= 22.5 && angle < 67.5) return "southwest";
  if (angle >= 67.5 && angle < 112.5) return "west";
  if (angle >= 112.5 && angle < 157.5) return "northwest";
  if (angle >= 157.5 || angle < -157.5) return "north";
  if (angle >= -157.5 && angle < -112.5) return "northeast";
  if (angle >= -112.5 && angle < -67.5) return "east";
  if (angle >= -67.5 && angle < -22.5) return "southeast";

  return "unknown";
}

function Zoomle() {
  const [targetCountry, setTargetCountry] = useState(null);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const todayIndex = getTodayCountryIndex();
    setTargetCountry(countries[todayIndex]);

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [
        countries[todayIndex].mapLocation.lon,
        countries[todayIndex].mapLocation.lat,
      ],
      zoom: 6,
    });

    return () => map.remove();
  }, []);

  const handleGuess = (countryName) => {
    if (!countryName || gameOver) return;

    const guessedCountry = countries.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    if (!guessedCountry) return;

    const distance = calculateDistance(
      guessedCountry.lat,
      guessedCountry.lon,
      targetCountry.lat,
      targetCountry.lon
    );
    const direction = getDirection(
      guessedCountry.lat,
      guessedCountry.lon,
      targetCountry.lat,
      targetCountry.lon
    );

    const isCorrect =
      guessedCountry.name.toLowerCase() ===
      targetCountry.name.toLowerCase();

    setGuesses((prev) => [
      ...prev,
      {
        name: guessedCountry.name,
        distance,
        direction,
        isCorrect,
      },
    ]);

    setGuess("");

    if (isCorrect || guesses.length + 1 >= 6) {
      setGameOver(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleGuess(guess.trim());
  };

  const handleOptionClick = (name) => {
    handleGuess(name);
  };

  const testRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const randomCountry = countries[randomIndex];
    setTargetCountry(randomCountry);

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [randomCountry.mapLocation.lon, randomCountry.mapLocation.lat],
      zoom: 6,
    });
  };

  const filteredCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(guess.toLowerCase())
  );

  return (
    <div className="zoomle-container">
      <h1>🌍 Zoomle</h1>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter country name"
          list="country-options"
        />
        <button type="submit">Guess</button>
        <datalist id="country-options">
          {filteredCountries.map((c) => (
            <option key={c.name} value={c.name} />
          ))}
        </datalist>
      </form>
      <div>
        {filteredCountries.map((c) => (
          <div
            key={c.name}
            onClick={() => handleOptionClick(c.name)}
            style={{ cursor: "pointer", padding: "2px" }}
          >
            {c.name}
          </div>
        ))}
      </div>
      <div className="guesses">
        {guesses.map((g, index) => (
          <div key={index}>
            {g.name} – {g.distance} km –{" "}
            <img
              src={`/arrows/${g.direction}.png`}
              alt={g.direction}
              style={{ width: "20px", verticalAlign: "middle" }}
            />
          </div>
        ))}
      </div>
      <p>
        Guess {guesses.length}/{6}
      </p>
      {gameOver && !guesses.find((g) => g.isCorrect) && (
        <p>The correct answer was: {targetCountry?.name}</p>
      )}
      <button onClick={testRandomCountry} style={{ marginTop: "10px" }}>
        🔁 Test Random Country
      </button>
    </div>
  );
}

export default Zoomle;
