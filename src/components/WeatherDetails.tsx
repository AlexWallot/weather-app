'use client';

import { useState } from 'react';
import { WeatherData } from '../app/interfaces/weatherData';
import { weatherCodes } from '../constants/weatherCodes';

interface WeatherDetailsProps {
  weatherData: WeatherData;
  dayIndex: number;
  onClose: () => void;
  t: (key: string) => string;
}

export const WeatherDetails = ({ weatherData, dayIndex, onClose, t }: WeatherDetailsProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'hourly' | 'details'>('overview');

  const dayData = {
    date: weatherData.daily.time[dayIndex],
    maxTemp: weatherData.daily.temperature_2m_max[dayIndex],
    minTemp: weatherData.daily.temperature_2m_min[dayIndex],
    weatherCode: weatherData.daily.weather_code[dayIndex],
    precipitation: weatherData.daily.precipitation_sum[dayIndex],
    precipitationProb: weatherData.daily.precipitation_probability_max[dayIndex],
    windSpeed: weatherData.daily.wind_speed_10m_max[dayIndex],
    uvIndex: weatherData.daily.uv_index_max[dayIndex]
  };

  const getHourlyData = () => {
    const startHour = dayIndex * 24;
    const endHour = startHour + 24;
    
    return {
      times: weatherData.hourly.time.slice(startHour, endHour),
      temperatures: weatherData.hourly.temperature_2m.slice(startHour, endHour),
      weatherCodes: weatherData.hourly.weather_code.slice(startHour, endHour),
      precipitation: weatherData.hourly.precipitation.slice(startHour, endHour),
      windSpeed: weatherData.hourly.wind_speed_10m.slice(startHour, endHour),
      humidity: weatherData.hourly.relative_humidity_2m.slice(startHour, endHour),
      cloudCover: weatherData.hourly.cloud_cover.slice(startHour, endHour),
      uvIndex: weatherData.hourly.uv_index.slice(startHour, endHour)
    };
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const hourlyData = getHourlyData();
  const weather = weatherCodes[dayData.weatherCode] || { emoji: '❓', description: 'Inconnu' };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {formatDate(dayData.date)}
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="bg-white/10 rounded-2xl p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'overview'
                  ? 'bg-white/30 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('details.overview')}
            </button>
            <button
              onClick={() => setActiveTab('hourly')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'hourly'
                  ? 'bg-white/30 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('details.hourly')}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === 'details'
                  ? 'bg-white/30 text-white shadow-lg'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('details.details')}
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-8xl mb-4">{weather.emoji}</div>
              <h3 className="text-3xl font-bold text-white mb-2">
                {Math.round(dayData.maxTemp)}°C / {Math.round(dayData.minTemp)}°C
              </h3>
              <p className="text-xl text-blue-100">{t(`weatherConditions.${dayData.weatherCode}`)}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-effect rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">🌧️</div>
                <p className="text-white font-semibold">{Math.round(dayData.precipitation)}mm</p>
                <p className="text-blue-200 text-sm">{t('weather.precipitation')}</p>
              </div>
              <div className="glass-effect rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">💨</div>
                <p className="text-white font-semibold">{Math.round(dayData.windSpeed)} km/h</p>
                <p className="text-blue-200 text-sm">{t('weather.wind')}</p>
              </div>
              <div className="glass-effect rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">☁️</div>
                <p className="text-white font-semibold">{Math.round(dayData.precipitationProb)}%</p>
                <p className="text-blue-200 text-sm">{t('details.precipitationProb')}</p>
              </div>
              <div className="glass-effect rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">☀️</div>
                <p className="text-white font-semibold">{Math.round(dayData.uvIndex)}</p>
                <p className="text-blue-200 text-sm">{t('details.uvIndex')}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hourly' && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white mb-4">{t('details.hourlyForecast')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {hourlyData.times.map((time, index) => (
                <div key={index} className="glass-effect rounded-xl p-3 text-center">
                  <p className="text-white/80 text-sm mb-2">{formatTime(time)}</p>
                  <div className="text-2xl mb-2">
                    {weatherCodes[hourlyData.weatherCodes[index]]?.emoji || '❓'}
                  </div>
                  <p className="text-white font-semibold">{Math.round(hourlyData.temperatures[index])}°</p>
                  <p className="text-blue-200 text-xs">
                    {Math.round(hourlyData.precipitation[index])}mm
                  </p>
                  <p className="text-blue-200 text-xs">
                    {Math.round(hourlyData.windSpeed[index])} km/h
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-4">{t('details.advancedInfo')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-effect rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('details.temperature')}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">{t('details.maxTemp')}</span>
                    <span className="text-white font-semibold">{Math.round(dayData.maxTemp)}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">{t('details.minTemp')}</span>
                    <span className="text-white font-semibold">{Math.round(dayData.minTemp)}°C</span>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('details.precipitation')}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">{t('details.totalPrecipitation')}</span>
                    <span className="text-white font-semibold">{Math.round(dayData.precipitation)}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">{t('details.precipitationProb')}</span>
                    <span className="text-white font-semibold">{Math.round(dayData.precipitationProb)}%</span>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('details.wind')}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">{t('details.maxWindSpeed')}</span>
                    <span className="text-white font-semibold">{Math.round(dayData.windSpeed)} km/h</span>
                  </div>
                </div>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">{t('details.uv')}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-blue-200">{t('details.maxUvIndex')}</span>
                    <span className="text-white font-semibold">{Math.round(dayData.uvIndex)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
