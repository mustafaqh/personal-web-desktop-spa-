/**
 * Taskbar app icon — launcher plus optional count badge and active dot.
 */
export default class AppButton {
  #btn;
  #badgeEl = null;
  #activeDotEl = null;
  #onClick = null;
  #onContextMenu = null;
  #onShiftActivate = null;

  /**
   * @param {{ title: string, icon?: string, appName: string, onClick?: (e: MouseEvent) => void, onContextMenu?: (e: MouseEvent) => void, onShiftActivate?: (e: KeyboardEvent) => boolean | void }} options
   */
  constructor({ title, icon, appName, onClick, onContextMenu, onShiftActivate }) {
    this.#onClick = onClick;
    this.#onContextMenu = onContextMenu;
    this.#onShiftActivate = onShiftActivate;

    this.#btn = document.createElement('button');
    this.#btn.type = 'button';
    this.#btn.className = 'taskbar-app-btn';
    this.#btn.dataset.appName = appName;
    this.#btn.title = title;
    this.#btn.setAttribute('aria-label', title);

    if (icon) {
      const img = document.createElement('img');
      img.src = icon;
      img.alt = '';
      this.#btn.appendChild(img);
    }

    this.#btn.addEventListener('click', (e) => {
      if (this.#onClick) this.#onClick(e);
    });

    this.#btn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.#onContextMenu) this.#onContextMenu(e);
    });

    this.#btn.addEventListener('keydown', (e) => {
      if (e.key === 'ContextMenu' || (e.key === 'F10' && e.shiftKey)) {
        e.preventDefault();
        if (this.#onContextMenu) this.#onContextMenu(e);
        return;
      }

      if (e.shiftKey && (e.key === 'Enter' || e.key === ' ')) {
        if (this.#onShiftActivate?.(e)) {
          e.preventDefault();
        }
      }
    });
  }

  /**
   * @param {number} count Open window count for this app.
   * @param {boolean} [showActiveDot] Show dot when exactly one visible window.
   */
  setWindowCount(count, showActiveDot = false) {
    this.#btn.dataset.count = String(count);

    if (this.#badgeEl) {
      this.#badgeEl.remove();
      this.#badgeEl = null;
    }

    if (count >= 2) {
      this.#badgeEl = document.createElement('span');
      this.#badgeEl.className = 'taskbar-badge';
      this.#badgeEl.textContent = String(count);
      this.#btn.appendChild(this.#badgeEl);
    }

    if (this.#activeDotEl) {
      this.#activeDotEl.remove();
      this.#activeDotEl = null;
    }

    if (count === 1 && showActiveDot) {
      this.#activeDotEl = document.createElement('span');
      this.#activeDotEl.className = 'taskbar-active-dot';
      this.#activeDotEl.setAttribute('aria-hidden', 'true');
      this.#btn.appendChild(this.#activeDotEl);
    }

    this.#btn.classList.toggle('has-windows', count > 0);
  }

  /**
   * @param {boolean} allMinimized True when every open window of this app is minimized.
   */
  setAllMinimized(allMinimized) {
    this.#btn.classList.toggle('is-all-minimized', allMinimized);
  }

  /**
   * @param {boolean} active Visible windows exist and not all minimized.
   */
  setActive(active) {
    this.#btn.classList.toggle('is-active', active);
  }

  /**
   * @param {string} title Tooltip text.
   */
  setTitle(title) {
    this.#btn.title = title;
  }

  get element() {
    return this.#btn;
  }
}
