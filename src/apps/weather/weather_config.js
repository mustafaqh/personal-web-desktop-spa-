/** Open-Meteo geocoding API (no API key required). */
export const WEATHER_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';

/** Open-Meteo forecast API (no API key required). */
export const WEATHER_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

/** localStorage key for the last searched city name. */
export const WEATHER_CITY_STORAGE_KEY = 'pwd-weather-city';

/** Default city when nothing is saved yet. */
export const WEATHER_DEFAULT_CITY = 'Växjö';

/** Number of forecast days requested from the API. */
export const WEATHER_FORECAST_DAYS = 3;

/**
 * Convert Open-Meteo WMO weather codes to readable text.
 * @param {number} code
 * @returns {string}
 */
export function describeWeatherCode(code) {
  const descriptions = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Fog',
    51: 'Drizzle',
    53: 'Drizzle',
    55: 'Drizzle',
    61: 'Rain',
    63: 'Rain',
    65: 'Rain',
    71: 'Snow',
    73: 'Snow',
    75: 'Snow',
    80: 'Rain showers',
    81: 'Rain showers',
    82: 'Rain showers',
    95: 'Thunderstorm',
  };

  return descriptions[code] ?? 'Unknown';
}
