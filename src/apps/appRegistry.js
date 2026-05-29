/**
 * Desktop app definitions and content factory for taskbar launchers.
 */

import { mountMemoryApp } from './memory/index.js';
import { mountChatApp } from './chat/index.js';
import { mountWeatherApp } from './weather/index.js';

/** @typedef {{ appName: string, title: string, icon: string }} DesktopApp */

/** @type {DesktopApp[]} */
export const desktopApps = [
  {
    appName: 'memory',
    title: 'Memory Game',
    icon: new URL('../../assets/icons/memory.svg', import.meta.url).href,
  },
  {
    appName: 'chat',
    title: 'Chat',
    icon: new URL('../../assets/icons/chat.svg', import.meta.url).href,
  },
  {
    appName: 'weather',
    title: 'Weather',
    icon: new URL('../../assets/icons/weather.svg', import.meta.url).href,
  },
];

/**
 * Create window content for a launcher click.
 * Dispatches to each app's mount function; unknown apps get a simple fallback view.
 * @param {DesktopApp} app
 * @returns {HTMLElement}
 */
export function createAppContent(app) {
  if (app.appName === 'memory') {
    return mountMemoryApp();
  }
  if (app.appName === 'chat') {
    return mountChatApp();
  }
  if (app.appName === 'weather') {
    return mountWeatherApp();
  }

  const root = document.createElement('div');
  root.className = 'app-placeholder';

  const heading = document.createElement('h3');
  heading.textContent = app.title;

  const message = document.createElement('p');
  message.textContent = 'This application is not available.';

  root.append(heading, message);
  return root;
}
