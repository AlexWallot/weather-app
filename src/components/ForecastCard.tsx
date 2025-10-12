import { memo } from 'react';
import { weatherCodes } from '../constants/weatherCodes';

interface ForecastCardProps {
  index: number;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitation: number;
  dayName: string;
  description: string;
  onSelect: (index: number) => void;
  t: (key: string) => string;
}

export const ForecastCard = memo(({
  index,
  maxTemp,
  minTemp,
  weatherCode,
  precipitation,
  dayName,
  description,
  onSelect,
  t
}: ForecastCardProps) => {
  const weather = {
    emoji: weatherCodes[weatherCode]?.emoji || '❓',
    description: description
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(index);
    }
  };

  return (
    <div 
      className="text-center p-4 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer hover:scale-105"
      onClick={() => onSelect(index)}
      role="button"
      tabIndex={0}
      aria-label={`${t('weather.forecast.day')} ${dayName} - ${Math.round(maxTemp)}°C / ${Math.round(minTemp)}°C - ${weather.description}`}
      onKeyDown={handleKeyDown}
    >
      <p className="text-white/90 text-sm mb-3 font-medium">{dayName}</p>
      <div className="text-3xl mb-3">{weather.emoji}</div>
      <p className="text-white text-lg font-semibold">{Math.round(maxTemp)}°</p>
      <p className="text-blue-200 text-sm">{Math.round(minTemp)}°</p>
      <p className="text-blue-300 text-xs mt-1">{t('weather.precipitation')}: {Math.round(precipitation)}%</p>
      <p className="text-blue-300 text-xs">{weather.description}</p>
      <p className="text-white/50 text-xs mt-2">Cliquez pour plus de détails</p>
    </div>
  );
});

ForecastCard.displayName = 'ForecastCard';
