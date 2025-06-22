import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <GlobeIcon darkMode={darkMode} />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Zoomle
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            <Link 
              to="/play" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Play Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
          Guess the <span className="text-blue-600">Country</span> from Space
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
          A daily geography challenge where you identify countries from satellite imagery. 
          Test your knowledge with 6 guesses per day!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <Link 
            to="/play" 
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Start Today's Challenge
          </Link>
          <Link 
            to="/how-to-play" 
            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
          >
            How to Play
          </Link>
        </div>

        {/* Feature Preview */}
        <div className="relative w-full max-w-3xl aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden shadow-xl mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6">
              <MapPinIcon className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Satellite map preview will appear here</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-6 border-t">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <GlobeIcon darkMode={darkMode} className="w-6 h-6" />
            <span className="font-medium">Zoomle</span>
          </div>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
              Privacy
            </Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
              About
            </Link>
            <Link to="/leaderboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
              Leaderboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Component: Globe Icon
function GlobeIcon({ darkMode, className = "" }) {
  return (
    <svg 
      className={`w-8 h-8 ${className}`} 
      fill="none" 
      viewBox="0 0 24 24"
      stroke={darkMode ? "#3B82F6" : "#2563EB"}
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// Component: Theme Toggle
function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      ) : (
        <MoonIcon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
}

// Icons (add to your icons file)
function SunIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}
