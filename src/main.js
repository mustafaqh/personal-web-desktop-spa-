import WindowManager from './ui/window/windowManager.js';
import Taskbar from './ui/compenents/Taskbar.js';
import { desktopApps } from './apps/appRegistry.js';

/**
 * Boot the Personal Web Desktop shell.
 */
function initDesktop() {
  const desktop = document.getElementById('desktop');
  if (!desktop) {
    throw new Error('Desktop element #desktop not found');
  }

  const windowManager = new WindowManager(desktop);

  new Taskbar(windowManager, {
    appsSection: document.getElementById('taskbar-apps'),
  }, desktopApps);

  initClock();
  initBlurToggle(desktop);
}

/**
 * Live clock in the desktop header.
 */
function initClock() {
  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');
  if (!timeEl || !dateEl) return;

  const updateClock = () => {
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    timeEl.textContent = `${hours}:${minutes}`;

    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    let formatted = now.toLocaleDateString('en-GB', options);
    formatted = formatted.replace(',', '');
    dateEl.textContent = formatted;
  };

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * @param {HTMLElement} desktop
 */
function initBlurToggle(desktop) {
  const blurBtn = document.getElementById('blur-toggle');
  const blurIcon = document.getElementById('blur-icon');
  if (!blurBtn || !blurIcon) return;

  const eyeOn = new URL('../assets/icons/eye.svg', import.meta.url).href;
  const eyeOff = new URL('../assets/icons/eye-off.svg', import.meta.url).href;

  let blurOn = true;

  blurBtn.addEventListener('click', () => {
    blurOn = !blurOn;

    if (blurOn) {
      desktop.classList.remove('no-blur');
      blurIcon.src = eyeOn;
    } else {
      desktop.classList.add('no-blur');
      blurIcon.src = eyeOff;
    }
  });
}

document.addEventListener('DOMContentLoaded', initDesktop);
