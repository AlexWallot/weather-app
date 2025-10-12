'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { weatherCodes } from '../constants/weatherCodes';
import { WeatherData } from './interfaces/weatherData';
import { useTranslation } from '../hooks/useTranslation';
import { LanguageSelector } from '../components/LanguageSelector';
import { PWAInstallPrompt } from '../components/PWAInstallPrompt';
import { useServiceWorker } from '../hooks/useServiceWorker';

// Lazy loading des composants lourds
const WeatherDetails = lazy(() => import('../components/WeatherDetails').then(module => ({ default: module.WeatherDetails })));

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'7days' | '14days'>('7days');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { t, language, changeLanguage } = useTranslation();
  
  // Initialiser le service worker
  useServiceWorker();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Géolocalisation réussie:', { latitude, longitude });
          setLocation({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
          let errorMessage = 'Impossible d\'obtenir votre localisation';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permission de géolocalisation refusée';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Position non disponible';
              break;
            case error.TIMEOUT:
              errorMessage = 'Délai d\'attente dépassé';
              break;
          }
          
          setError(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      setError('Géolocalisation non supportée par ce navigateur');
    }
  }, []);

  const fetchWeather = async (lat?: number, lon?: number, city?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Validation des paramètres
      if (lat !== undefined && lon !== undefined) {
        // Vérifier que les coordonnées sont valides
        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          throw new Error('Coordonnées invalides');
        }
      }
      
      let url = '/api/weather?';
      if (lat !== undefined && lon !== undefined) {
        url += `lat=${lat}&lon=${lon}`;
      } else if (city) {
        url += `city=${encodeURIComponent(city)}`;
      } else {
        setError('Paramètres manquants');
        setLoading(false);
        return;
      }

      console.log('Fetching weather from:', url);
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error || `Erreur API (${response.status})`);
      }

      setWeatherData(data);
    } catch (err) {
      console.error('Erreur fetch weather:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des données météo');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(undefined, undefined, searchQuery.trim());
    }
  };

  const getCurrentWeather = () => {
    if (!weatherData) return null;
    const code = weatherData.current.weather_code;
    const weatherCode = weatherCodes[code] || { emoji: '❓', description: 'Inconnu' };
    return {
      emoji: weatherCode.emoji,
      description: t(`weatherConditions.${code}`) || t('weatherConditions.unknown')
    };
  };

  const getForecastDays = (days: number) => {
    if (!weatherData) return [];
    return weatherData.daily.temperature_2m_max.slice(0, days);
  };

  const getDayName = (index: number) => {
    const dayNames = [
      t('days.monday'),
      t('days.tuesday'),
      t('days.wednesday'),
      t('days.thursday'),
      t('days.friday'),
      t('days.saturday'),
      t('days.sunday')
    ];
    const today = new Date();
    return dayNames[(today.getDay() + index) % 7];
  };

  const renderForecastSection = (days: number, title: string) => {
    if (!weatherData) return null;

    return (
      <div className="glass-effect rounded-2xl p-8 border border-white/20">
        <h2 className="text-white text-2xl font-bold mb-6 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
          {getForecastDays(days).map((maxTemp, index) => {
            const minTemp = weatherData.daily.temperature_2m_min[index];
            const weatherCode = weatherData.daily.weather_code[index];
            const precipitation = weatherData.daily.precipitation_probability_max[index];
            const weather = {
              emoji: weatherCodes[weatherCode]?.emoji || '❓',
              description: t(`weatherConditions.${weatherCode}`) || t('weatherConditions.unknown')
            };
            
            return (
              <div 
                key={index} 
                className="text-center p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => setSelectedDay(index)}
              >
                <p className="text-white/90 text-sm mb-3 font-medium">{getDayName(index)}</p>
                <div className="text-3xl mb-3">{weather.emoji}</div>
                <p className="text-white text-lg font-semibold">{Math.round(maxTemp)}°</p>
                <p className="text-blue-200 text-sm">{Math.round(minTemp)}°</p>
                <p className="text-blue-300 text-xs mt-1">{t('weather.precipitation')}: {Math.round(precipitation)}%</p>
                <p className="text-blue-300 text-xs">{weather.description}</p>
                <p className="text-white/50 text-xs mt-2">Cliquez pour plus de détails</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen weather-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in-up">
          <div className="flex justify-between items-center mb-8">
            <div></div>
            <LanguageSelector language={language} onChange={changeLanguage} />
          </div>
          <h1 className="text-6xl font-bold text-white mb-6 drop-shadow-2xl tracking-tight">
            {t('app.title')}
          </h1>
          <p className="text-2xl text-blue-100 font-light">
            {t('app.subtitle')}
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <div className="glass-effect rounded-3xl p-8 shadow-2xl animate-fade-in-up">
            <form onSubmit={handleSearch} className="text-center mb-10">
              <div className="relative max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input w-full px-8 py-5 rounded-2xl bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-transparent backdrop-blur-sm text-lg"
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-xl p-4 transition-all duration-300 hover:scale-110 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-8 text-center">
                <p className="text-red-100">{t(`messages.${error}`)}</p>
              </div>
            )}

            {weatherData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="weather-card glass-effect rounded-2xl p-8 text-center border border-white/20 hover:border-white/40">
                    <div className="text-6xl mb-4">{getCurrentWeather()?.emoji}</div>
                    <h3 className="text-white font-bold text-xl mb-3">{getCurrentWeather()?.description}</h3>
                    <p className="text-blue-100 text-3xl font-bold mb-2">{Math.round(weatherData.current.temperature_2m)}°C</p>
                    <p className="text-blue-200 text-sm">{t('weather.humidity')}: {weatherData.current.relative_humidity_2m}%</p>
                    <p className="text-blue-200 text-sm">{t('weather.wind')}: {Math.round(weatherData.current.wind_speed_10m)} km/h</p>
                  </div>
                  
                  <div className="weather-card glass-effect rounded-2xl p-8 text-center border border-white/20 hover:border-white/40">
                    <div className="text-4xl mb-4">🌡️</div>
                    <h3 className="text-white font-bold text-xl mb-3">{t('weather.temperature')}</h3>
                    <p className="text-blue-100 text-2xl font-bold mb-2">{Math.round(weatherData.current.temperature_2m)}°C</p>
                    <p className="text-blue-200 text-sm">{t('weather.feelsLike')}</p>
                  </div>
                  
                  <div className="weather-card glass-effect rounded-2xl p-8 text-center border border-white/20 hover:border-white/40">
                    <div className="text-4xl mb-4">💨</div>
                    <h3 className="text-white font-bold text-xl mb-3">{t('weather.wind')}</h3>
                    <p className="text-blue-100 text-2xl font-bold mb-2">{Math.round(weatherData.current.wind_speed_10m)} km/h</p>
                    <p className="text-blue-200 text-sm">{t('weather.speed')}</p>
                  </div>
                </div>

                <div className="flex justify-center mb-8">
                  <div className="bg-white/10 rounded-2xl p-2 flex gap-2">
                    <button
                      onClick={() => setActiveTab('7days')}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeTab === '7days'
                          ? 'bg-white/30 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t('tabs.7days')}
                    </button>
                    <button
                      onClick={() => setActiveTab('14days')}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                        activeTab === '14days'
                          ? 'bg-white/30 text-white shadow-lg'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {t('tabs.14days')}
                    </button>
                  </div>
                </div>

                {activeTab === '7days' && renderForecastSection(7, t('weather.forecast.7days'))}
                {activeTab === '14days' && renderForecastSection(14, t('weather.forecast.14days'))}
              </>
            )}

            {!weatherData && !loading && !error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌍</div>
                <p className="text-white/80 text-xl">{t('messages.searchCityOrLocation')}</p>
              </div>
            )}
        </div>
      </main>

        <footer className="text-center mt-16 animate-fade-in-up">
          <p className="text-white/80 text-lg">
            {t('footer.text')}
          </p>
        </footer>
      </div>

      {selectedDay !== null && weatherData && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="glass-effect rounded-3xl p-8 text-center">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Chargement...</p>
            </div>
          </div>
        }>
          <WeatherDetails
            weatherData={weatherData}
            dayIndex={selectedDay}
            onClose={() => setSelectedDay(null)}
            t={t}
          />
        </Suspense>
      )}
      
      <PWAInstallPrompt />
    </div>
  );
}
