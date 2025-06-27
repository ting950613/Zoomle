import { useState } from 'react';
import Logo from './components/Logo';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const games = [
    {
      id: 1,
      title: "Zoomle",
      description: "Guess countries from satellite imagery",
      icon: "🌍",
      stats: "Daily Challenge"
    },
    {
      id: 2, 
      title: "Coming Soon",
      description: "More games in development",
      icon: "🛠️",
      stats: "Under Construction"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-gray-100'}`}>
      
      {/* Navigation */}
      <nav className={`backdrop-blur-xs ${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo className="h-10" />
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
              Guessverse
            </span>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
            Discover <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Guessverse</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of beautifully designed guessing games
          </p>
        </section>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game) => (
            <div 
              key={game.id}
              className={`rounded-2xl overflow-hidden backdrop-blur-xs border ${darkMode ? 'bg-gray-800/30 border-gray-700' : 'bg-white/30 border-gray-200'} hover:shadow-lg transition-all`}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{game.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{game.title}</h3>
                    <p className="text-sm text-primary-light">{game.stats}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{game.description}</p>
                <button className={`w-full py-2 rounded-lg ${darkMode ? 'bg-primary-light hover:bg-primary' : 'bg-primary hover:bg-primary-light'} text-white transition-colors`}>
                  {game.id === 1 ? 'Play Now' : 'Notify Me'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-8 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center gap-6 mb-4">
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Guessverse. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
