export interface WeatherData {
  temperatureC: number;
  apparentTemperatureC: number;
  relativeHumidity: number;
  windSpeedKmh: number;
  windDirectionDeg: number;
  windDirectionCardinal: string;
  weatherCode: number;
  weatherDescription: string;
  directRadiationWpm2: number;
  surfacePressureHpa: number;
  timestamp: string;
  source: 'LIVE API DATA' | 'FALLBACK SIMULATION';
}

function getWindCardinal(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

function getWeatherDescription(code: number): string {
  switch (code) {
    case 0: return 'Clear sky';
    case 1: return 'Mainly clear';
    case 2: return 'Partly cloudy';
    case 3: return 'Overcast';
    case 45: case 48: return 'Fog';
    case 51: case 53: case 55: return 'Drizzle';
    case 61: case 63: case 65: return 'Rain';
    case 71: case 73: case 75: return 'Snow';
    case 80: case 81: case 82: return 'Rain showers';
    case 95: return 'Thunderstorm';
    default: return 'Variable conditions';
  }
}

export async function fetchSiteWeather(lat: number, lng: number): Promise<WeatherData> {
  const baseUrl = (import.meta as any).env?.VITE_OPEN_METEO_BASE_URL || 'https://api.open-meteo.com/v1';
  const url = `${baseUrl}/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,direct_normal_irradiance&timezone=auto`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Open-Meteo API returned status ${res.status}`);
    }

    const data = await res.json();
    const current = data.current;

    return {
      temperatureC: current.temperature_2m,
      apparentTemperatureC: current.apparent_temperature,
      relativeHumidity: current.relative_humidity_2m,
      windSpeedKmh: current.wind_speed_10m,
      windDirectionDeg: current.wind_direction_10m,
      windDirectionCardinal: getWindCardinal(current.wind_direction_10m),
      weatherCode: current.weather_code,
      weatherDescription: getWeatherDescription(current.weather_code),
      directRadiationWpm2: current.direct_normal_irradiance ?? 0,
      surfacePressureHpa: current.surface_pressure ?? 1013,
      timestamp: current.time,
      source: 'LIVE API DATA',
    };
  } catch (err) {
    // Graceful fallback with clear labeling
    return {
      temperatureC: 32.4,
      apparentTemperatureC: 35.1,
      relativeHumidity: 48,
      windSpeedKmh: 14.2,
      windDirectionDeg: 220,
      windDirectionCardinal: 'SW',
      weatherCode: 1,
      weatherDescription: 'Mainly clear (Offline Cache)',
      directRadiationWpm2: 680,
      surfacePressureHpa: 1012,
      timestamp: new Date().toISOString(),
      source: 'FALLBACK SIMULATION',
    };
  }
}
