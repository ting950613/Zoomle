import React from 'react';
import { Link } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"; // <-- Add this import

export default function App() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to GuessVerse</h1>
      <p className="mb-4">Choose your game:</p>
      <div className="flex flex-col gap-4 items-center">
        <Link to="/zoomle" className="text-blue-500 hover:underline">Play Zoomle</Link>
      </div>
      <Analytics /> {/* <-- Add this before closing the main div */}
    </div>
  );
}
