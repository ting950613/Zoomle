
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import countries from '../data/countries.json';
import './Zoomle.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibWljaGhlbHRpbmdmeSIsImEiOiJjbWMybG90NW4wOW51MnJvZzhtbjV2a2VmIn0.ChuSb3DlCEXTjlaW1tC-FA';

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getDirectionArrow(lat1, lon1, lat2, lon2) {
    const angle = Math.atan2(lon2 - lon1, lat2 - lat1) * 180 / Math.PI;
    const directions = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
    const index = Math.round(((angle + 360) % 360) / 45) % 8;
    return directions[index];
}

function getDailyCountry() {
    const seed = Math.floor(new Date().setHours(0, 0, 0, 0) / 86400000);
    return countries[seed % countries.length];
}

const Zoomle = () => {
    const mapContainer = useRef(null);
    const [guess, setGuess] = useState('');
    const [guesses, setGuesses] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [answer] = useState(getDailyCountry());

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [answer.lon, answer.lat],
            zoom: 1,
            interactive: false
        });

        return () => map.remove();
    }, [answer]);

    const handleGuess = (countryName) => {
        if (gameOver || guesses.find(g => g.name === countryName)) return;

        const country = countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
        if (!country) return;

        const distance = getDistance(country.lat, country.lon, answer.lat, answer.lon);
        const direction = getDirectionArrow(country.lat, country.lon, answer.lat, answer.lon);

        const newGuess = {
            name: country.name,
            distance: Math.round(distance),
            direction
        };

        const updatedGuesses = [...guesses, newGuess];
        setGuesses(updatedGuesses);
        setGuess('');
        setFilteredCountries([]);

        if (country.name === answer.name || updatedGuesses.length >= 6) {
            setGameOver(true);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setGuess(value);
        setFilteredCountries(
            value
                ? countries.filter(c => c.name.toLowerCase().startsWith(value.toLowerCase())).slice(0, 10)
                : []
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleGuess(guess);
        }
    };

    return (
        <div className="zoomle-container">
            <div className="map-container" ref={mapContainer} />
            <div className="game-panel">
                <input
                    type="text"
                    value={guess}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Guess the country"
                />
                <ul className="dropdown">
                    {filteredCountries.map(c => (
                        <li key={c.name} className="dropdown-item" onClick={() => handleGuess(c.name)}>
                            {c.name}
                        </li>
                    ))}
                </ul>
                <div className="guess-list">
                    {guesses.map((g, idx) => (
                        <div key={idx}>
                            {idx + 1}/6 – {g.name} — {g.distance} km {g.direction}
                        </div>
                    ))}
                </div>
                {gameOver && (
                    <div className="result">
                        {guesses.some(g => g.name === answer.name)
                            ? '🎉 Correct!'
                            : `The correct answer was: ${answer.name}`}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Zoomle;
