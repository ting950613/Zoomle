import { useState } from 'react';
import Logo from './components/Logo';
import GameCard from './components/GameCard';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const games = [
    {
      title: "Zoomle",
      description: "Guess countries from satellite images",
      icon: "🌍",
      path: "/zoomle"
    },
    {
      title: "Wordle",
      description: "Daily word guessing challenge",
      icon: "🔠", 
      path: "/wordle",
      comingSoon: true
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Guessverse
            </span>
          </div>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Welcome to <span className="text-blue-600 dark:text-blue-400">Guessverse</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of fun guessing games that test your knowledge
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {games.map((game, index) => (
            <GameCard
              key={index}
              title={game.title}
              description={game.description}
              icon={game.icon}
              path={game.path}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
              Privacy
            </a>
            <a href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-500">
              About
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Guessverse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
