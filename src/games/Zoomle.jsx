
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import countries from '../data/countries';

export default function Zoomle() {
  const today = new Date().toISOString().split('T')[0];
  const [guess, setGuess] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const correctCountry = 'Canada'; // placeholder for today's answer

  const handleInputChange = (e) => {
    const input = e.target.value;
    setGuess(input);
    setFilteredCountries(countries.filter(c =>
      c.toLowerCase().startsWith(input.toLowerCase())
    ));
    setShowDropdown(true);
  };

  const handleSelectCountry = (country) => {
    setGuess(country);
    setSelectedCountry(country);
    setShowDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!guess) return;
    const direction = getDirection(guess, correctCountry);
    setGuesses([...guesses, { country: guess, direction }]);
    setGuess('');
    setShowDropdown(false);
  };

  const getDirection = (from, to) => {
    // Dummy logic: you should use lat/lng in real case
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Zoomle - {today}</h2>

      <form onSubmit={handleSubmit} className="mb-4 relative">
        <input
          type="text"
          value={guess}
          onChange={handleInputChange}
          placeholder="Type a country..."
          className="border p-2 w-64"
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && (
          <ul className="absolute w-64 bg-white border mt-1 z-10 max-h-60 overflow-y-auto">
            {filteredCountries.map((country) => (
              <li
                key={country}
                onClick={() => handleSelectCountry(country)}
                className="cursor-pointer hover:bg-gray-100 p-2 text-left"
              >
                {country}
              </li>
            ))}
          </ul>
        )}
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Guess
        </button>
      </form>

      <ul className="mt-4 space-y-2">
        {guesses.map((g, i) => (
          <li key={i} className="flex items-center justify-center gap-2">
            <span>{g.country}</span>
            <img src={`/arrows/${g.direction}.svg`} alt={g.direction} className="w-5 h-5" />
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link to="/emovi" className="text-blue-500 underline">Play Emovi →</Link>
      </div>
    </div>
  );
}
