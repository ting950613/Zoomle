import React from 'react';
import { Link } from 'react-router-dom';

export default function Emovi() {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Emovi - {today}</h2>
      <p>This is where your movie guessing game logic will go.</p>
      <div className="mt-6">
        <Link to="/zoomle" className="text-blue-500 underline">Play Zoomle →</Link>
      </div>
    </div>
  );
}
