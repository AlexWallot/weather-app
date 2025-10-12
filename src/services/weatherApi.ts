import axios from 'axios';

const weatherApi = axios.create({
  baseURL: '/api/weather',
  timeout: 15000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
weatherApi.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.url, config.params);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
weatherApi.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export const fetchWeather = async (lat?: number, lon?: number, city?: string) => {
  const params: any = {};
  
  if (lat !== undefined && lon !== undefined) {
    params.lat = lat.toString();
    params.lon = lon.toString();
  } else if (city) {
    params.city = city;
  } else {
    throw new Error('Coordonnées ou ville requises');
  }

  try {
    const response = await weatherApi.get('', { params });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || error.message || 'Erreur API météo');
    }
    throw error;
  }
};

export default weatherApi;
