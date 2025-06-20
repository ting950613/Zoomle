
import React, { useState, useEffect } from "react";
import countries from "../data/countries_with_mapLocations.json";
import "./Zoomle.css";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = "pk.eyJ1IjoibWljaGhlbHRpbmdmeSIsImEiOiJjbWMybG90NW4wOW51MnJvZzhtbjV2a2VmIn0.ChuSb3DlCEXTjlaW1tC-FA";

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDailyIndex() {
  const today = new Date();
  const start = new Date("2024-01-01");
  const diffDays = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return diffDays % countries.length;
}

function getDailyMapLocation(country) {
  const today = new Date();
  const index = today.getDate() % country.mapLocations.length;
  return country.mapLocations[index];
}

export default function Zoomle() {
  const [map, setMap] = useState(null);
  const [guess, setGuess] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [correctCountry, setCorrectCountry] = useState(null);

  useEffect(() => {
    const index = getDailyIndex();
    const country = countries[index];
    setCorrectCountry(country);

    const center = getDailyMapLocation(country);

    const newMap = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [center.lon, center.lat],
      zoom: 6,
    });

    setMap(newMap);
  }, []);

  function handleGuessSubmit(e) {
    e.preventDefault();
    if (!guess) return;

    const guessed = countries.find(
      (c) => c.name.toLowerCase() === guess.toLowerCase()
    );

    if (guessed) {
      const dist = haversineDistance(
        guessed.lat,
        guessed.lon,
        correctCountry.lat,
        correctCountry.lon
      );
      const newGuess = {
        name: guessed.name,
        distance: dist.toFixed(0),
        isCorrect: guessed.name === correctCountry.name,
      };

      const updatedGuesses = [...guesses, newGuess];
      setGuesses(updatedGuesses);
      setGuess("");

      if (newGuess.isCorrect || updatedGuesses.length === 6) {
        setIsGameOver(true);
      }
    }
  }

  return (
    <div>
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
      {!isGameOver && (
        <form onSubmit={handleGuessSubmit}>
          <input
            list="countries"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter country name"
          />
          <datalist id="countries">
            {countries.map((c) => (
              <option key={c.name} value={c.name} />
            ))}
          </datalist>
          <button type="submit">Guess</button>
        </form>
      )}

      <ul>
        {guesses.map((g, idx) => (
          <li key={idx}>
            {g.name} - {g.distance} km{" "}
            {g.isCorrect ? "✅" : <img src={`/arrows/arrow.svg`} alt="→" />}
          </li>
        ))}
      </ul>

      {isGameOver && (
        <div>
          <p>The correct answer was: {correctCountry.name}</p>
        </div>
      )}
    </div>
  );
}
