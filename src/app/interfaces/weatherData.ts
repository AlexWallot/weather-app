export interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    weather_code: number;
    wind_speed_10m: number;
    apparent_temperature: number;
    precipitation: number;
    cloud_cover: number;
    uv_index: number;
  };
  hourly: {
    temperature_2m: number[];
    relative_humidity_2m: number[];
    weather_code: number[];
    wind_speed_10m: number[];
    precipitation_probability: number[];
    precipitation: number[];
    cloud_cover: number[];
    uv_index: number[];
    time: string[];
  };
  daily: {
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    uv_index_max: number[];
    time: string[];
  };
}