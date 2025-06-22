import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './components/Logo'; // Changed from { Logo } to Logo

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const games = [
    {
      id: 'zoomle',
      name: 'Zoomle',
      desc: 'Guess countries from satellite maps',
      icon: '🛰️',
      path: '/zoomle',
      color: 'from-blue-600 to-blue-400'
    },
    {
      id: 'puzzlia',
      name: 'Puzzlia',
      desc: 'Geography puzzle adventure',
      icon: '🧩',
      path: '/puzzlia',
      color: 'from-purple-600 to-pink-500',
      comingSoon: true
    }
  ];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <Logo darkMode={darkMode} className="h-10" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
              Guessverse
            </span>
          </Link>
          <nav className="flex items-center gap-6">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link 
              to="/login" 
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium rounded-lg transition-all"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 py-12 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Play. Guess. <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Win.</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of mind-challenging games that test your knowledge about the world.
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.comingSoon ? '#' : game.path}
              className={`group relative overflow-hidden rounded-xl p-1 ${game.comingSoon ? 'opacity-70' : 'hover:shadow-lg'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-10 group-hover:opacity-20 transition-all`} />
              <div className="relative h-full bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{game.icon}</span>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {game.name}
                    {game.comingSoon && (
                      <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-3">{game.desc}</p>
                {game.comingSoon ? (
                  <p className="text-sm text-blue-500 dark:text-blue-400">Launching Q3 2024</p>
                ) : (
                  <div className="text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
                    Play Now 
                    <span aria-hidden="true">→</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <Link to="/" className="flex items-center gap-2">
                <Logo darkMode={darkMode} className="h-8" />
                <span className="font-bold text-gray-800 dark:text-white">Guessverse</span>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:underline">
                Privacy
              </Link>
              <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:underline">
                About
              </Link>
              <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:underline">
                Contact
              </Link>
              <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:underline">
                Blog
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Guessverse.io. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
