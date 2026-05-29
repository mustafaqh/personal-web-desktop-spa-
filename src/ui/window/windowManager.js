import WindowFrame from './windowFrame.js';
import { clampWindowPosition, DESKTOP_BOUNDARY } from './windowBounds.js';

/**
 * WindowManager — creates, tracks, and controls all desktop windows.
 */
/** Cascade placement tuning (desktop coordinates). */
const PLACEMENT = {
  startX: 80,
  startY: 60,
  offsetX: 36,
  offsetY: 32,
  columnGap: 180,
  taskbarReserve: DESKTOP_BOUNDARY.taskbarReserve,
  margin: DESKTOP_BOUNDARY.margin,
};

export default class WindowManager {
  /** @type {Map<number, { id: number, appName: string, title: string, frame: WindowFrame, state: 'normal' | 'minimized' }>} */
  #windows = new Map();
  #nextId = 1;
  #desktopEl;
  /** @type {Map<string, Array<function>>} */
  #listeners = new Map();
  #focusedId = null;
  #placementIndex = 0;

  /**
   * @param {HTMLElement} desktopEl
   */
  constructor(desktopEl) {
    this.#desktopEl = desktopEl;
    this.#onWindowResize = () => this.#clampAllVisibleWindows();
    window.addEventListener('resize', this.#onWindowResize);
  }

  /** @type {() => void} */
  #onWindowResize;

  /**
   * @param {string} appName
   * @param {HTMLElement} contentElement
   * @param {{ title?: string }} [options]
   * @returns {number}
   */
  createWindow(appName, contentElement, options = {}) {
    const id = this.#nextId++;
    const title = options.title ?? appName;

    const frame = new WindowFrame({ title });
    frame.setContent(contentElement);
    frame.mount(this.#desktopEl);

    const el = frame.getElement();
    const { width, height } = el.getBoundingClientRect();
    const { left, top } = this.#getNextWindowPosition(width, height);
    const clamped = clampWindowPosition(this.#desktopEl, el, left, top);
    frame.setPosition(clamped.left, clamped.top);

    frame.setOnClose(() => this.closeWindow(id));
    frame.setOnMinimize(() => this.minimizeWindow(id));
    frame.setOnFocus(() => this.focusWindow(id));

    const record = {
      id,
      appName,
      title,
      frame,
      state: /** @type {'normal'} */ ('normal'),
    };

    this.#windows.set(id, record);
    this.focusWindow(id);

    this.#emit('windowCreated', {
      id,
      appName,
      title,
      state: 'normal',
    });

    return id;
  }

  /**
   * @param {number} id
   */
  closeWindow(id) {
    const record = this.#windows.get(id);
    if (!record) return;

    record.frame.destroy();
    this.#windows.delete(id);

    if (this.#focusedId === id) {
      this.#focusedId = null;
    }

    this.#emit('windowClosed', {
      id,
      appName: record.appName,
      title: record.title,
    });
  }

  /**
   * @param {number} id
   */
  minimizeWindow(id) {
    const record = this.#windows.get(id);
    if (!record || record.state === 'minimized') return;

    record.frame.minimize();
    record.state = 'minimized';

    this.#emit('windowMinimized', {
      id,
      appName: record.appName,
      title: record.title,
    });
  }

  /**
   * @param {number} id
   */
  showWindow(id) {
    const record = this.#windows.get(id);
    if (!record) return;

    record.frame.show();
    record.state = 'normal';
    this.focusWindow(id);

    this.#emit('windowRestored', {
      id,
      appName: record.appName,
      title: record.title,
    });
  }

  /**
   * @param {number} id
   */
  focusWindow(id) {
    const record = this.#windows.get(id);
    if (!record) return;

    record.frame.bringToFront();
    this.#focusedId = id;

    this.#emit('windowFocused', {
      id,
      appName: record.appName,
      title: record.title,
      state: record.state,
    });
  }

  /**
   * @param {number} id
   * @returns {{ id: number, appName: string, title: string, frame: WindowFrame, state: string } | null}
   */
  getWindow(id) {
    return this.#windows.get(id) ?? null;
  }

  /**
   * @returns {number | null}
   */
  getFocusedWindowId() {
    return this.#focusedId;
  }

  /**
   * @param {string} appName
   * @returns {Array<{ id: number, appName: string, title: string, frame: WindowFrame, state: string }>}
   */
  getWindowsByApp(appName) {
    const result = [];
    for (const record of this.#windows.values()) {
      if (record.appName === appName) {
        result.push(record);
      }
    }
    return result;
  }

  /**
   * @param {string} appName
   * @returns {boolean}
   */
  hasWindow(appName) {
    return this.getWindowsByApp(appName).length > 0;
  }

  /**
   * Close every open window for one app. Other apps are unaffected.
   * @param {string} appName
   * @returns {number} Number of windows closed.
   */
  closeWindowsByApp(appName) {
    const ids = this.getWindowsByApp(appName).map((record) => record.id);
    for (const id of ids) {
      this.closeWindow(id);
    }
    return ids.length;
  }

  /**
   * @returns {Array<{ id: number, appName: string, title: string, frame: WindowFrame, state: string }>}
   */
  getWindows() {
    return Array.from(this.#windows.values());
  }

  /**
   * Most recently created minimized window for an app (highest id), or null.
   * @param {string} appName
   * @returns {{ id: number, appName: string, title: string, frame: WindowFrame, state: string } | null}
   */
  getMostRecentMinimizedWindowByApp(appName) {
    const minimized = this.getWindowsByApp(appName).filter((w) => w.state === 'minimized');
    if (minimized.length === 0) return null;

    return minimized.reduce((latest, current) => (
      current.id > latest.id ? current : latest
    ));
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
   * Next cascade position with column wrap (does not move existing windows).
   * @param {number} width
   * @param {number} height
   * @returns {{ left: number, top: number }}
   */
  #getNextWindowPosition(width, height) {
    const {
      startX,
      startY,
      offsetX,
      offsetY,
      columnGap,
      taskbarReserve,
      margin,
    } = PLACEMENT;

    const desktopWidth = this.#desktopEl.clientWidth;
    const desktopHeight = this.#desktopEl.clientHeight;
    const availableWidth = desktopWidth;
    const availableHeight = desktopHeight - taskbarReserve;

    const w = Math.min(width, availableWidth - startX - margin);
    const h = Math.min(height, availableHeight - startY - margin);

    const usableHeight = availableHeight - startY - margin;
    const rowsPerColumn = Math.max(
      1,
      Math.floor((usableHeight - h) / offsetY) + 1,
    );

    const columnGapEff = Math.max(columnGap, w + offsetX);
    const usableWidth = availableWidth - startX - margin;
    const maxColumns = Math.max(1, Math.floor(usableWidth / columnGapEff));

    const index = this.#placementIndex;
    const column = Math.floor(index / rowsPerColumn) % maxColumns;
    const row = index % rowsPerColumn;

    let left = startX + column * columnGapEff + row * offsetX;
    let top = startY + row * offsetY;

    left = Math.max(startX, Math.min(left, availableWidth - w - margin));
    top = Math.max(startY, Math.min(top, availableHeight - h - margin));

    this.#placementIndex += 1;

    return { left, top };
  }

  /** Re-clamp visible windows after viewport resize. */
  #clampAllVisibleWindows() {
    for (const record of this.#windows.values()) {
      if (record.state !== 'minimized') {
        record.frame.ensureInBounds();
      }
    }
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
