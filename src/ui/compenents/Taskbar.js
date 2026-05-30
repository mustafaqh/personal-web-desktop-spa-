import AppButton from './AppButton.js';
import { createAppContent } from '../../apps/appRegistry.js';

/**
 * Taskbar — one dock icon per app (launcher + open-window count/status).
 */
export default class Taskbar {
  #windowManager;
  #appsSectionEl;
  #appsList;
  /** @type {Map<string, AppButton>} */
  #appButtons = new Map();
  /** @type {HTMLElement | null} */
  #contextMenuEl = null;
  /** @type {HTMLButtonElement | null} */
  #contextMenuItemEl = null;
  /** @type {import('../../apps/appRegistry.js').DesktopApp | null} */
  #contextMenuApp = null;
  /** @type {HTMLElement | null} */
  #contextMenuAnchor = null;
  /** @type {(e: PointerEvent) => void} */
  #onDocumentPointerDown;
  /** @type {(e: KeyboardEvent) => void} */
  #onDocumentKeydown;

  /**
   * @param {import('../window/windowManager.js').default} windowManager
   * @param {{ appsSection: HTMLElement }} elements
   * @param {import('../../apps/appRegistry.js').DesktopApp[]} appsList
   */
  constructor(windowManager, elements, appsList) {
    this.#windowManager = windowManager;
    this.#appsSectionEl = elements.appsSection;
    this.#appsList = appsList;

    this.#onDocumentPointerDown = (e) => this.#handleDocumentPointerDown(e);
    this.#onDocumentKeydown = (e) => this.#handleDocumentKeydown(e);

    this.#windowManager.on('windowCreated', () => this.#syncAllApps());
    this.#windowManager.on('windowClosed', () => this.#syncAllApps());
    this.#windowManager.on('windowMinimized', () => this.#syncAllApps());
    this.#windowManager.on('windowRestored', () => this.#syncAllApps());
    this.#windowManager.on('windowFocused', () => this.#syncAllApps());

    this.#createContextMenu();
    document.addEventListener('pointerdown', this.#onDocumentPointerDown);
    document.addEventListener('keydown', this.#onDocumentKeydown);

    this.#renderAppIcons();
    this.#syncAllApps();
  }

  #createContextMenu() {
    const menu = document.createElement('div');
    menu.className = 'taskbar-context-menu';
    menu.setAttribute('role', 'menu');
    menu.hidden = true;

    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'taskbar-context-menu-item';
    item.setAttribute('role', 'menuitem');
    item.dataset.action = 'close-all';

    item.addEventListener('click', () => {
      if (this.#contextMenuApp) {
        this.#windowManager.closeWindowsByApp(this.#contextMenuApp.appName);
      }
      this.#closeContextMenu();
    });

    menu.appendChild(item);
    document.body.appendChild(menu);

    this.#contextMenuEl = menu;
    this.#contextMenuItemEl = item;
  }

  #renderAppIcons() {
    this.#appsSectionEl.replaceChildren();

    for (const app of this.#appsList) {
      const button = new AppButton({
        title: `Open ${app.title}`,
        icon: app.icon,
        appName: app.appName,
        onClick: (e) => this.#handleAppClick(app, e),
        onContextMenu: (e) => this.#handleAppContextMenu(app, e),
        onShiftActivate: () => this.#handleAppShiftActivate(app),
      });

      this.#appButtons.set(app.appName, button);
      this.#appsSectionEl.appendChild(button.element);
    }
  }

  /**
   * @param {import('../../apps/appRegistry.js').DesktopApp} app
   * @param {MouseEvent | KeyboardEvent} e
   */
  #handleAppContextMenu(app, e) {
    const count = this.#windowManager.getWindowsByApp(app.appName).length;
    if (count === 0) return;

    const anchor = e.currentTarget;
    if (!(anchor instanceof HTMLElement)) return;

    this.#openContextMenu(app, anchor);
  }

  /**
   * @param {import('../../apps/appRegistry.js').DesktopApp} app
   * @param {HTMLElement} anchor
   */
  #openContextMenu(app, anchor) {
    if (!this.#contextMenuEl || !this.#contextMenuItemEl) return;

    this.#closeContextMenu();

    this.#contextMenuApp = app;
    this.#contextMenuAnchor = anchor;
    this.#contextMenuItemEl.textContent = `Close all ${app.title} windows`;
    this.#contextMenuEl.hidden = false;

    requestAnimationFrame(() => {
      if (!this.#contextMenuEl || this.#contextMenuEl.hidden) return;
      this.#positionContextMenu(anchor);
      this.#contextMenuItemEl?.focus();
    });
  }

  /**
   * @param {import('../../apps/appRegistry.js').DesktopApp} app
   * @returns {boolean} Whether a minimized window was restored.
   */
  #restoreMostRecentMinimized(app) {
    const minimized = this.#windowManager.getMostRecentMinimizedWindowByApp(app.appName);
    if (minimized) {
      this.#windowManager.showWindow(minimized.id);
      return true;
    }
    return false;
  }

  /**
   * @param {import('../../apps/appRegistry.js').DesktopApp} app
   * @returns {boolean} Whether a minimized window was restored.
   */
  #handleAppShiftActivate(app) {
    return this.#restoreMostRecentMinimized(app);
  }

  /**
   * @param {HTMLElement} anchor
   */
  #positionContextMenu(anchor) {
    if (!this.#contextMenuEl) return;

    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = this.#contextMenuEl.getBoundingClientRect();
    const gap = 10;
    const pad = 8;

    let left = anchorRect.left + anchorRect.width / 2 - menuRect.width / 2;
    let top = anchorRect.top - menuRect.height - gap;

    if (top < pad) {
      top = anchorRect.bottom + gap;
    }

    left = Math.max(pad, Math.min(left, window.innerWidth - menuRect.width - pad));
    top = Math.max(pad, Math.min(top, window.innerHeight - menuRect.height - pad));

    this.#contextMenuEl.style.left = `${left}px`;
    this.#contextMenuEl.style.top = `${top}px`;
  }

  #closeContextMenu() {
    if (!this.#contextMenuEl) return;

    const anchor = this.#contextMenuAnchor;
    this.#contextMenuEl.hidden = true;
    this.#contextMenuApp = null;
    this.#contextMenuAnchor = null;

    if (anchor instanceof HTMLElement && document.contains(anchor)) {
      anchor.focus({ preventScroll: true });
    }
  }

  /**
   * @param {PointerEvent} e
   */
  #handleDocumentPointerDown(e) {
    if (!this.#contextMenuEl || this.#contextMenuEl.hidden) return;

    const target = /** @type {Node} */ (e.target);
    if (this.#contextMenuEl.contains(target)) return;

    this.#closeContextMenu();
  }

  /**
   * @param {KeyboardEvent} e
   */
  #handleDocumentKeydown(e) {
    if (e.key === 'Escape') {
      this.#closeContextMenu();
    }
  }

  /**
   * @param {import('../../apps/appRegistry.js').DesktopApp} app
   * @param {MouseEvent} e
   */
  #handleAppClick(app, _e) {
    this.#closeContextMenu();

    if (this.#restoreMostRecentMinimized(app)) {
      return;
    }

    const content = createAppContent(app);
    this.#windowManager.createWindow(app.appName, content, { title: app.title });
  }

  /** Recompute badges and states from WindowManager. */
  #syncAllApps() {
    for (const app of this.#appsList) {
      const button = this.#appButtons.get(app.appName);
      if (!button) continue;

      const windows = this.#windowManager.getWindowsByApp(app.appName);
      const count = windows.length;
      const allMinimized = count > 0 && windows.every((w) => w.state === 'minimized');
      const hasVisible = windows.some((w) => w.state === 'normal');

      button.setWindowCount(count, count === 1 && hasVisible);
      button.setAllMinimized(allMinimized);
      button.setActive(hasVisible);
      button.setTitle(this.#buildTooltip(app.title, count, allMinimized));
    }
  }

  /**
   * @param {string} title
   * @param {number} count
   * @param {boolean} allMinimized
   * @returns {string}
   */
  #buildTooltip(title, count, allMinimized) {
    if (count === 0) {
      return `Open ${title}`;
    }

    if (allMinimized) {
      const label = count === 1 ? 'window' : 'windows';
      return `Open ${title} — ${count} ${label} minimized (click to restore, right-click for options)`;
    }

    if (count === 1) {
      return `Open ${title} — 1 window open (right-click for options)`;
    }

    return `Open ${title} — ${count} windows open (right-click for options)`;
  }
}
