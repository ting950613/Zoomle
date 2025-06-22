import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StarsIcon, PuzzleIcon } from './components/Icons';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  // Sample games data (add more later)
  const games = [
    {
      id: 'zoomle',
      name: 'Zoomle',
      description: 'Guess countries from satellite imagery',
      icon: '🌍',
      path: '/zoomle',
      comingSoon: false
    },
    {
      id: 'puzzlia',
      name: 'Puzzlia',
      description: 'Geography puzzle challenge',
      icon: '🧩',
      path: '/puzzlia',
      comingSoon: true
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <StarsIcon darkMode={darkMode} />
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Guessverse
            </span>
          </Link>
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to <span className="text-purple-600">Guessverse</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A universe of guessing games that test your knowledge about our world.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.comingSoon ? '#' : game.path}
              className={`block p-6 rounded-xl border-2 transition-all ${
                game.comingSoon
                  ? 'border-gray-300 dark:border-gray-700 opacity-70'
                  : 'border-transparent hover:border-purple-400 hover:shadow-lg bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center gap-4 mb-3">
                <span className="text-3xl">{game.icon}</span>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  {game.name}
                  {game.comingSoon && (
                    <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{game.description}</p>
              {game.comingSoon && (
                <p className="mt-3 text-sm text-purple-600 dark:text-purple-400">
                  Launching 2024
                </p>
              )}
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-8 border-t">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-purple-500">
              Privacy Policy
            </Link>
            <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-purple-500">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-500">
              Contact
            </Link>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Guessverse.io - A universe of guessing games
          </p>
        </div>
      </footer>
    </div>
  );
}
