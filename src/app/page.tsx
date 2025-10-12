'use client';

import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen weather-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
            WeatherApp
          </h1>
          <p className="text-2xl text-blue-100 font-light">
            Découvrez la météo en temps réel
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="glass-effect rounded-3xl p-8 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-10">
              <div className="relative max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="Rechercher une ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full px-8 py-5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-transparent backdrop-blur-sm text-lg"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-110">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="weather-card glass-effect rounded-2xl p-8 text-center border border-white/20 hover:border-white/40">
                <div className="text-6xl mb-4 animate-pulse">🌤️</div>
                <h3 className="text-white font-bold text-xl mb-3">Ensoleillé</h3>
                <p className="text-blue-100 text-lg font-medium">25°C</p>
                <p className="text-blue-200 text-sm mt-2">Humidité: 65%</p>
              </div>
              
              <div className="weather-card glass-effect rounded-2xl p-8 text-center border border-white/20 hover:border-white/40">
                <div className="text-6xl mb-4 animate-pulse">⛅</div>
                <h3 className="text-white font-bold text-xl mb-3">Nuageux</h3>
                <p className="text-blue-100 text-lg font-medium">22°C</p>
                <p className="text-blue-200 text-sm mt-2">Humidité: 78%</p>
              </div>
              
              <div className="weather-card glass-effect rounded-2xl p-8 text-center border border-white/20 hover:border-white/40">
                <div className="text-6xl mb-4 animate-pulse">🌧️</div>
                <h3 className="text-white font-bold text-xl mb-3">Pluvieux</h3>
                <p className="text-blue-100 text-lg font-medium">18°C</p>
                <p className="text-blue-200 text-sm mt-2">Humidité: 85%</p>
              </div>
            </div>

            <div className="glass-effect rounded-2xl p-8 border border-white/20">
              <h2 className="text-white text-2xl font-bold mb-6 text-center">Prévisions 7 jours</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                  <div key={index} className="text-center p-4 rounded-xl hover:bg-white/10 transition-all duration-300">
                    <p className="text-white/90 text-sm mb-3 font-medium">{day}</p>
                    <div className="text-3xl mb-3">☀️</div>
                    <p className="text-white text-lg font-semibold">25°</p>
                    <p className="text-blue-200 text-sm">18°</p>
                    <p className="text-blue-300 text-xs mt-1">Pluie: 20%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        <footer className="text-center mt-16 animate-fade-in-up">
          <p className="text-white/80 text-lg">
            Application météo moderne • Développée avec Next.js & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
}
