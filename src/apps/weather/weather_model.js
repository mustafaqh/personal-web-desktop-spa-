import {
  WEATHER_GEOCODING_URL,
  WEATHER_FORECAST_URL,
  WEATHER_CITY_STORAGE_KEY,
  WEATHER_DEFAULT_CITY,
  WEATHER_FORECAST_DAYS,
  describeWeatherCode,
} from './weather_config.js';

/**
 * @typedef {object} WeatherLocation
 * @property {string} name
 * @property {string} country
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {object} CurrentWeather
 * @property {number} temperature
 * @property {number} humidity
 * @property {number} windSpeed
 * @property {string} condition
 * @property {string} observedAt
 */

/**
 * @typedef {object} DailyForecast
 * @property {string} date
 * @property {string} condition
 * @property {number} tempMax
 * @property {number} tempMin
 */

/**
 * Weather data and API calls for one window instance.
 */
export class WeatherModel {
  /** @type {string} */
  #cityQuery = WEATHER_DEFAULT_CITY;
  /** @type {WeatherLocation | null} */
  #location = null;
  /** @type {CurrentWeather | null} */
  #current = null;
  /** @type {DailyForecast[]} */
  #forecast = [];
  #loading = false;
  #error = '';
  #destroyed = false;
  /** @type {AbortController | null} */
  #abortController = null;
  /** @type {Map<string, Array<function>>} */
  #listeners = new Map();

  /**
   * @returns {string}
   */
  static getStoredCity() {
    try {
      const stored = localStorage.getItem(WEATHER_CITY_STORAGE_KEY)?.trim();
      return stored || WEATHER_DEFAULT_CITY;
    } catch {
      return WEATHER_DEFAULT_CITY;
    }
  }

  /**
   * @param {string} city
   */
  static saveCity(city) {
    try {
      localStorage.setItem(WEATHER_CITY_STORAGE_KEY, city.trim());
    } catch {
      // Ignore storage errors.
    }
  }

  /**
   * @returns {string}
   */
  get cityQuery() {
    return this.#cityQuery;
  }

  /**
   * @returns {WeatherLocation | null}
   */
  get location() {
    return this.#location;
  }

  /**
   * @returns {CurrentWeather | null}
   */
  get current() {
    return this.#current;
  }

  /**
   * @returns {readonly DailyForecast[]}
   */
  get forecast() {
    return this.#forecast;
  }

  /**
   * @returns {boolean}
   */
  get loading() {
    return this.#loading;
  }

  /**
   * @returns {string}
   */
  get error() {
    return this.#error;
  }

  /**
   * @param {string} cityName
   */
  async searchCity(cityName) {
    const trimmed = cityName.trim();
    if (!trimmed) {
      this.#setError('Please enter a city name.');
      this.#emitState();
      return;
    }

    await this.#loadWeather(trimmed);
  }

  /** Reload weather for the current city query. */
  async refresh() {
    const city = this.#cityQuery.trim() || WeatherModel.getStoredCity();
    await this.#loadWeather(city);
  }

  /** Load last saved city (or default) on first open. */
  async loadInitial() {
    const city = WeatherModel.getStoredCity();
    this.#cityQuery = city;
    await this.#loadWeather(city);
  }

  destroy() {
    this.#destroyed = true;
    this.#abortController?.abort();
    this.#abortController = null;
    this.#listeners.clear();
  }

  /**
   * @param {string} eventName
   * @param {function} handler
   */
  on(eventName, handler) {
    if (!this.#listeners.has(eventName)) {
      this.#listeners.set(eventName, []);
    }
    this.#listeners.get(eventName).push(handler);
  }

  /**
   * @param {string} cityName
   */
  async #loadWeather(cityName) {
    if (this.#destroyed) return;

    this.#abortController?.abort();
    this.#abortController = new AbortController();
    const { signal } = this.#abortController;

    this.#cityQuery = cityName;
    this.#setLoading(true);
    this.#setError('');
    this.#emitState();

    try {
      const location = await this.#fetchGeocode(cityName, signal);
      if (!location) {
        this.#location = null;
        this.#current = null;
        this.#forecast = [];
        this.#setError(`City not found: ${cityName}`);
        return;
      }

      const forecastData = await this.#fetchForecast(location, signal);
      this.#location = location;
      this.#current = forecastData.current;
      this.#forecast = forecastData.daily;
      WeatherModel.saveCity(cityName);
    } catch (err) {
      if (/** @type {Error} */ (err).name === 'AbortError') return;

      this.#location = null;
      this.#current = null;
      this.#forecast = [];
      this.#setError('Could not load weather. Check your connection and try again.');
    } finally {
      if (!this.#destroyed) {
        this.#setLoading(false);
        this.#emitState();
      }
    }
  }

  /**
   * @param {string} cityName
   * @param {AbortSignal} signal
   * @returns {Promise<WeatherLocation | null>}
   */
  async #fetchGeocode(cityName, signal) {
    const url = new URL(WEATHER_GEOCODING_URL);
    url.searchParams.set('name', cityName);
    url.searchParams.set('count', '1');
    url.searchParams.set('language', 'en');
    url.searchParams.set('format', 'json');

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Geocoding failed (${response.status})`);
    }

    const data = await response.json();
    const result = data?.results?.[0];
    if (!result) return null;

    return {
      name: String(result.name ?? cityName),
      country: String(result.country ?? result.country_code ?? ''),
      latitude: Number(result.latitude),
      longitude: Number(result.longitude),
    };
  }

  /**
   * @param {WeatherLocation} location
   * @param {AbortSignal} signal
   * @returns {Promise<{ current: CurrentWeather, daily: DailyForecast[] }>}
   */
  async #fetchForecast(location, signal) {
    const url = new URL(WEATHER_FORECAST_URL);
    url.searchParams.set('latitude', String(location.latitude));
    url.searchParams.set('longitude', String(location.longitude));
    url.searchParams.set(
      'current',
      'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
    );
    url.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
    url.searchParams.set('forecast_days', String(WEATHER_FORECAST_DAYS));
    url.searchParams.set('timezone', 'auto');

    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Forecast failed (${response.status})`);
    }

    const data = await response.json();
    const current = data?.current;
    const daily = data?.daily;

    if (!current || !daily) {
      throw new Error('Invalid forecast response');
    }

    const observedAt = this.#formatDateTime(current.time);

    const currentWeather = {
      temperature: Number(current.temperature_2m),
      humidity: Number(current.relative_humidity_2m),
      windSpeed: Number(current.wind_speed_10m),
      condition: describeWeatherCode(Number(current.weather_code)),
      observedAt,
    };

    const dailyForecast = [];
    const times = daily.time ?? [];

    for (let i = 0; i < Math.min(WEATHER_FORECAST_DAYS, times.length); i += 1) {
      dailyForecast.push({
        date: this.#formatDate(times[i]),
        condition: describeWeatherCode(Number(daily.weather_code?.[i])),
        tempMax: Number(daily.temperature_2m_max?.[i]),
        tempMin: Number(daily.temperature_2m_min?.[i]),
      });
    }

    return { current: currentWeather, daily: dailyForecast };
  }

  /**
   * @param {string} iso
   * @returns {string}
   */
  #formatDateTime(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  /**
   * @param {string} iso
   * @returns {string}
   */
  #formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * @param {boolean} loading
   */
  #setLoading(loading) {
    this.#loading = loading;
  }

  /**
   * @param {string} message
   */
  #setError(message) {
    this.#error = message;
  }

  #emitState() {
    this.#emit('stateChanged', {
      cityQuery: this.#cityQuery,
      location: this.#location,
      current: this.#current,
      forecast: this.#forecast,
      loading: this.#loading,
      error: this.#error,
    });
  }

  /**
   * @param {string} eventName
   * @param {object} payload
   */
  #emit(eventName, payload) {
    const handlers = this.#listeners.get(eventName);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(payload);
    }
  }
}
