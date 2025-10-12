import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const city = searchParams.get('city');

  try {
    console.log('API Weather - Params:', { lat, lon, city });
    
    let url = 'https://api.open-meteo.com/v1/forecast?';
    
    if (lat && lon) {
      // Validation des coordonnées
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lon);
      
      if (isNaN(latitude) || isNaN(longitude)) {
        return NextResponse.json({ error: 'Coordonnées invalides' }, { status: 400 });
      }
      
      if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
        return NextResponse.json({ error: 'Coordonnées hors limites' }, { status: 400 });
      }
      
      url += `latitude=${latitude}&longitude=${longitude}`;
    } else if (city) {
      const geocodingResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=fr&format=json`
      );
      const geocodingData = await geocodingResponse.json();
      
      if (geocodingData.results && geocodingData.results.length > 0) {
        const location = geocodingData.results[0];
        url += `latitude=${location.latitude}&longitude=${location.longitude}`;
      } else {
        return NextResponse.json({ error: 'Ville non trouvée' }, { status: 404 });
      }
    } else {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    url += '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,precipitation,cloud_cover,uv_index&hourly=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation_probability,precipitation,cloud_cover,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,uv_index_max&timezone=auto&forecast_days=14';

        console.log('API Weather - Final URL:', url);
        const response = await axios.get(url, {
          timeout: 10000,
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'WeatherApp/1.0'
          }
        });

        console.log('API Weather - Response status:', response.status);
        console.log('API Weather - Response data:', response.data);

        return NextResponse.json(response.data);
  } catch (error) {
    console.error('Erreur API météo:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.error || error.message || 'Erreur API météo';
      
      return NextResponse.json({ 
        error: message,
        details: error.response?.data || error.message
      }, { status });
    }
    
    return NextResponse.json({ 
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}
