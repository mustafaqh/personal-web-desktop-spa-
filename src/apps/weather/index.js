import '../../../style/apps/weather.css';
import { WeatherModel } from './weather_model.js';
import { WeatherView } from './weather_view.js';
import { WeatherController } from './weather_controller.js';

/**
 * Create and mount one independent Weather app instance.
 * @returns {HTMLElement} Root element to place inside a window.
 */
export function mountWeatherApp() {
  const model = new WeatherModel();
  const view = new WeatherView();
  const controller = new WeatherController(model, view);

  const root = view.root;

  const disconnectObserver = new MutationObserver(() => {
    if (!root.isConnected) {
      controller.destroy();
      disconnectObserver.disconnect();
    }
  });

  disconnectObserver.observe(document.body, { childList: true, subtree: true });

  return root;
}
