/** @typedef {import('./weather_model.js').WeatherLocation} WeatherLocation */
/** @typedef {import('./weather_model.js').CurrentWeather} CurrentWeather */
/** @typedef {import('./weather_model.js').DailyForecast} DailyForecast */

/**
 * DOM for one Weather window (scoped to root).
 */
export class WeatherView {
  /** @type {HTMLElement} */
  root;
  /** @type {HTMLInputElement} */
  #cityInputEl;
  /** @type {HTMLElement} */
  #statusEl;
  /** @type {HTMLElement} */
  #currentCardEl;
  /** @type {HTMLElement} */
  #forecastEl;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'weather-app';

    const searchArea = document.createElement('section');
    searchArea.className = 'weather-search';

    const searchLabel = document.createElement('label');
    searchLabel.className = 'weather-label';
    searchLabel.textContent = 'City';

    this.#cityInputEl = document.createElement('input');
    this.#cityInputEl.type = 'text';
    this.#cityInputEl.className = 'weather-input';
    this.#cityInputEl.placeholder = 'Search city…';
    this.#cityInputEl.setAttribute('aria-label', 'City name');

    searchLabel.appendChild(this.#cityInputEl);

    const searchBtn = document.createElement('button');
    searchBtn.type = 'button';
    searchBtn.className = 'weather-btn';
    searchBtn.textContent = 'Search';
    searchBtn.dataset.action = 'search';

    const refreshBtn = document.createElement('button');
    refreshBtn.type = 'button';
    refreshBtn.className = 'weather-btn weather-btn-secondary';
    refreshBtn.textContent = 'Refresh';
    refreshBtn.dataset.action = 'refresh';

    const searchActions = document.createElement('div');
    searchActions.className = 'weather-search-actions';
    searchActions.append(searchBtn, refreshBtn);

    searchArea.append(searchLabel, searchActions);

    this.#statusEl = document.createElement('p');
    this.#statusEl.className = 'weather-status';
    this.#statusEl.setAttribute('role', 'status');
    this.#statusEl.setAttribute('aria-live', 'polite');
    this.#statusEl.hidden = true;

    this.#currentCardEl = document.createElement('section');
    this.#currentCardEl.className = 'weather-current';
    this.#currentCardEl.hidden = true;

    const forecastHeading = document.createElement('h3');
    forecastHeading.className = 'weather-forecast-heading';
    forecastHeading.textContent = '3-day forecast';

    this.#forecastEl = document.createElement('div');
    this.#forecastEl.className = 'weather-forecast-grid';
    this.#forecastEl.setAttribute('role', 'list');

    this.root.append(searchArea, this.#statusEl, this.#currentCardEl, forecastHeading, this.#forecastEl);
  }

  /**
   * @param {string} value
   */
  clearCityInput() {
    this.#cityInputEl.value = '';
  }

  /**
   * @returns {string}
   */
  getCityInput() {
    return this.#cityInputEl.value;
  }

  /**
   * @param {EventTarget | null} target
   * @returns {boolean}
   */
  isCityInput(target) {
    return target === this.#cityInputEl;
  }

  /**
   * @param {boolean} loading
   * @param {string} error
   */
  setStatus(loading, error) {
    if (loading) {
      this.#statusEl.hidden = false;
      this.#statusEl.textContent = 'Loading weather…';
      this.#statusEl.className = 'weather-status weather-status-loading';
      return;
    }

    if (error) {
      this.#statusEl.hidden = false;
      this.#statusEl.textContent = error;
      this.#statusEl.className = 'weather-status weather-status-error';
      return;
    }

    this.#statusEl.hidden = true;
    this.#statusEl.textContent = '';
    this.#statusEl.className = 'weather-status';
  }

  /**
   * @param {boolean} busy
   */
  setControlsEnabled(busy) {
    this.#cityInputEl.disabled = busy;
    const buttons = this.root.querySelectorAll('.weather-btn');
    for (const btn of buttons) {
      if (btn instanceof HTMLButtonElement) {
        btn.disabled = busy;
      }
    }
  }

  /**
   * @param {WeatherLocation | null} location
   * @param {CurrentWeather | null} current
   */
  renderCurrent(location, current) {
    this.#currentCardEl.replaceChildren();

    if (!location || !current) {
      this.#currentCardEl.hidden = true;
      return;
    }

    this.#currentCardEl.hidden = false;

    const title = document.createElement('h2');
    title.className = 'weather-current-title';
    title.textContent = location.country
      ? `${location.name}, ${location.country}`
      : location.name;

    const temp = document.createElement('p');
    temp.className = 'weather-temp';
    temp.textContent = `${Math.round(current.temperature)}°C`;

    const condition = document.createElement('p');
    condition.className = 'weather-condition';
    condition.textContent = current.condition;

    const details = document.createElement('ul');
    details.className = 'weather-details';

    details.append(
      this.#detailItem('Wind', `${Math.round(current.windSpeed)} km/h`),
      this.#detailItem('Humidity', `${Math.round(current.humidity)}%`),
      this.#detailItem('Observed', current.observedAt),
    );

    this.#currentCardEl.append(title, temp, condition, details);
  }

  /**
   * @param {DailyForecast[]} forecast
   */
  renderForecast(forecast) {
    this.#forecastEl.replaceChildren();

    for (const day of forecast) {
      const card = document.createElement('article');
      card.className = 'weather-forecast-card';
      card.setAttribute('role', 'listitem');

      const date = document.createElement('h4');
      date.className = 'weather-forecast-date';
      date.textContent = day.date;

      const condition = document.createElement('p');
      condition.className = 'weather-forecast-condition';
      condition.textContent = day.condition;

      const temps = document.createElement('p');
      temps.className = 'weather-forecast-temps';
      temps.textContent = `↑ ${Math.round(day.tempMax)}°C  ↓ ${Math.round(day.tempMin)}°C`;

      card.append(date, condition, temps);
      this.#forecastEl.appendChild(card);
    }
  }

  /**
   * @param {string} label
   * @param {string} value
   * @returns {HTMLLIElement}
   */
  #detailItem(label, value) {
    const item = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    const span = document.createElement('span');
    span.textContent = value;
    item.append(strong, span);
    return item;
  }
}
