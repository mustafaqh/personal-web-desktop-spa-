/**
 * Connects Weather model and view for one window instance.
 */
export class WeatherController {
  /** @type {import('./weather_model.js').WeatherModel} */
  #model;
  /** @type {import('./weather_view.js').WeatherView} */
  #view;
  /** @type {((e: Event) => void) | null} */
  #onRootClick = null;
  /** @type {((e: KeyboardEvent) => void) | null} */
  #onRootKeydown = null;

  /**
   * @param {import('./weather_model.js').WeatherModel} model
   * @param {import('./weather_view.js').WeatherView} view
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#model.on('stateChanged', (state) => {
      if (!this.#view.root.isConnected) return;
      this.#render(state);
    });

    this.#bindUi();
    this.#bootstrap();
  }

  async #bootstrap() {
    await this.#model.loadInitial();
  }

  #bindUi() {
    const root = this.#view.root;

    this.#onRootClick = (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      const actionEl = target.closest('[data-action]');
      if (!actionEl || !root.contains(actionEl)) return;

      const action = actionEl.getAttribute('data-action');
      if (action === 'search') {
        void this.#searchFromInput();
      } else if (action === 'refresh') {
        void this.#model.refresh();
      }
    };

    this.#onRootKeydown = (e) => {
      if (!root.contains(/** @type {Node} */ (e.target))) return;

      if (e.key === 'Enter' && this.#view.isCityInput(e.target)) {
        e.preventDefault();
        void this.#searchFromInput();
      }
    };

    root.addEventListener('click', this.#onRootClick);
    root.addEventListener('keydown', this.#onRootKeydown);
  }

  async #searchFromInput() {
    const query = this.#view.getCityInput();
    await this.#model.searchCity(query);
    if (!this.#model.error && this.#model.location) {
      this.#view.clearCityInput();
    }
  }

  /**
   * @param {object} state
   */
  #render(state) {
    this.#view.setStatus(state.loading, state.error);
    this.#view.setControlsEnabled(state.loading);
    this.#view.renderCurrent(state.location, state.current);
    this.#view.renderForecast(state.forecast);
  }

  destroy() {
    if (this.#onRootClick) {
      this.#view.root.removeEventListener('click', this.#onRootClick);
    }
    if (this.#onRootKeydown) {
      this.#view.root.removeEventListener('keydown', this.#onRootKeydown);
    }
    this.#model.destroy();
  }
}
