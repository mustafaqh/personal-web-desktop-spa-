import { clampWindowPosition } from './windowBounds.js';

/**
 * WindowFrame — single window UI (title bar, controls, content, drag).
 */
export default class WindowFrame {
  static #nextZIndex = 10;

  #windowFrame;
  #windowTitleBar;
  #buttonsWrapper;
  #closeBtn;
  #minimizeBtn;
  #windowTitle;
  #windowContent;
  #isDragging = false;
  #offsetX = 0;
  #offsetY = 0;
  #onClose = null;
  #onMinimize = null;
  #onFocus = null;
  #onTitlePointerDown;
  #onContentPointerDown;
  #onWindowPointerMove;
  #onWindowPointerUp;

  /**
   * @param {{ title?: string }} [options]
   */
  constructor(options = {}) {
    this.#windowFrame = document.createElement('div');
    this.#windowFrame.className = 'window-frame';

    this.#windowTitleBar = document.createElement('div');
    this.#windowTitleBar.className = 'window-titlebar';

    this.#buttonsWrapper = document.createElement('div');
    this.#buttonsWrapper.className = 'window-buttons';

    this.#closeBtn = document.createElement('button');
    this.#closeBtn.type = 'button';
    this.#closeBtn.className = 'win-btn close-btn';
    this.#closeBtn.setAttribute('aria-label', 'Close window');
    const closeIcon = document.createElement('img');
    closeIcon.src = new URL('../../../assets/icons/close_black.svg', import.meta.url).href;
    closeIcon.alt = '';
    this.#closeBtn.appendChild(closeIcon);

    this.#minimizeBtn = document.createElement('button');
    this.#minimizeBtn.type = 'button';
    this.#minimizeBtn.className = 'win-btn min-btn';
    this.#minimizeBtn.setAttribute('aria-label', 'Minimize window');
    const minIcon = document.createElement('img');
    minIcon.src = new URL('../../../assets/icons/minimize_black.svg', import.meta.url).href;
    minIcon.alt = '';
    this.#minimizeBtn.appendChild(minIcon);

    this.#windowTitle = document.createElement('span');
    this.#windowTitle.className = 'window-title';
    this.#windowTitle.textContent = options.title ?? 'App';

    this.#windowContent = document.createElement('div');
    this.#windowContent.className = 'window-content';

    this.#buttonsWrapper.append(this.#closeBtn, this.#minimizeBtn);
    this.#windowTitleBar.append(this.#buttonsWrapper, this.#windowTitle);
    this.#windowFrame.append(this.#windowTitleBar, this.#windowContent);

    const stopTitleBarDrag = (e) => {
      e.stopPropagation();
    };

    this.#closeBtn.addEventListener('pointerdown', stopTitleBarDrag);
    this.#minimizeBtn.addEventListener('pointerdown', stopTitleBarDrag);

    this.#closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.#onClose?.();
    });

    this.#minimizeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.#onMinimize?.();
    });

    this.#onTitlePointerDown = (e) => this.#handleTitlePointerDown(e);
    this.#onContentPointerDown = (e) => this.#handleContentPointerDown(e);
    this.#onWindowPointerMove = (e) => this.#handlePointerMove(e);
    this.#onWindowPointerUp = (e) => this.#handlePointerUp(e);

    this.#windowTitleBar.addEventListener('pointerdown', this.#onTitlePointerDown);
    this.#windowContent.addEventListener('pointerdown', this.#onContentPointerDown);
    window.addEventListener('pointermove', this.#onWindowPointerMove);
    window.addEventListener('pointerup', this.#onWindowPointerUp);
    window.addEventListener('pointercancel', this.#onWindowPointerUp);
  }

  /**
   * @returns {HTMLElement}
   */
  getElement() {
    return this.#windowFrame;
  }

  /**
   * @param {HTMLElement} parent
   */
  mount(parent) {
    parent.appendChild(this.#windowFrame);
  }

  /**
   * @param {HTMLElement} child
   */
  setContent(child) {
    this.#windowContent.replaceChildren(child);
  }

  /**
   * @param {string} title
   */
  setTitle(title) {
    this.#windowTitle.textContent = title;
  }

  /**
   * @param {() => void} handler
   */
  setOnClose(handler) {
    this.#onClose = handler;
  }

  /**
   * @param {() => void} handler
   */
  setOnMinimize(handler) {
    this.#onMinimize = handler;
  }

  /**
   * @param {() => void} handler
   */
  setOnFocus(handler) {
    this.#onFocus = handler;
  }

  minimize() {
    this.#windowFrame.classList.add('hidden');
  }

  show() {
    this.#windowFrame.classList.remove('hidden');
    this.bringToFront();
  }

  bringToFront() {
    this.#windowFrame.style.zIndex = String(WindowFrame.#nextZIndex++);
    if (!this.isHidden()) {
      this.ensureInBounds();
    }
  }

  /**
   * @returns {boolean}
   */
  isHidden() {
    return this.#windowFrame.classList.contains('hidden');
  }

  destroy() {
    this.#windowTitleBar.removeEventListener('pointerdown', this.#onTitlePointerDown);
    this.#windowContent.removeEventListener('pointerdown', this.#onContentPointerDown);
    window.removeEventListener('pointermove', this.#onWindowPointerMove);
    window.removeEventListener('pointerup', this.#onWindowPointerUp);
    window.removeEventListener('pointercancel', this.#onWindowPointerUp);
    this.#windowFrame.remove();
  }

  /**
   * Set position and clamp inside the desktop (coordinates relative to offsetParent).
   * @param {number} left
   * @param {number} top
   */
  setPosition(left, top) {
    const desktop = this.#getDesktopElement();
    if (!desktop) {
      this.#windowFrame.style.left = `${left}px`;
      this.#windowFrame.style.top = `${top}px`;
    } else {
      const clamped = clampWindowPosition(desktop, this.#windowFrame, left, top);
      this.#windowFrame.style.left = `${clamped.left}px`;
      this.#windowFrame.style.top = `${clamped.top}px`;
    }
    this.#windowFrame.style.transform = 'none';
  }

  /** Pull window back if the title bar is outside the desktop bounds. */
  ensureInBounds() {
    const desktop = this.#getDesktopElement();
    if (!desktop) return;

    const left = Number.parseFloat(this.#windowFrame.style.left) || 0;
    const top = Number.parseFloat(this.#windowFrame.style.top) || 0;
    const clamped = clampWindowPosition(desktop, this.#windowFrame, left, top);

    this.#windowFrame.style.left = `${clamped.left}px`;
    this.#windowFrame.style.top = `${clamped.top}px`;
  }

  /**
   * @returns {HTMLElement | null}
   */
  #getDesktopElement() {
    const parent = this.#windowFrame.offsetParent;
    return parent instanceof HTMLElement ? parent : null;
  }

  /** Notify manager and raise z-index without starting a drag. */
  #focusWindow() {
    this.#onFocus?.();
    this.bringToFront();
  }

  /**
   * Focus on content click only; drag stays on the title bar.
   * @param {PointerEvent} e
   */
  #handleContentPointerDown(e) {
    if (e.button !== 0) return;
    this.#focusWindow();
  }

  #handleTitlePointerDown(e) {
    if (e.button !== 0) return;

    const target = /** @type {HTMLElement} */ (e.target);
    if (target.closest('.window-buttons, .win-btn')) {
      return;
    }

    e.preventDefault();
    this.#focusWindow();

    const desktop = this.#getDesktopElement();
    if (!desktop) return;

    const desktopRect = desktop.getBoundingClientRect();
    const frameRect = this.#windowFrame.getBoundingClientRect();

    let left = frameRect.left - desktopRect.left;
    let top = frameRect.top - desktopRect.top;
    ({ left, top } = clampWindowPosition(desktop, this.#windowFrame, left, top));
    this.#windowFrame.style.left = `${left}px`;
    this.#windowFrame.style.top = `${top}px`;

    this.#offsetX = e.clientX - desktopRect.left - left;
    this.#offsetY = e.clientY - desktopRect.top - top;

    this.#isDragging = true;
    this.#windowTitleBar.setPointerCapture(e.pointerId);
  }

  #handlePointerMove(e) {
    if (!this.#isDragging) return;

    const desktop = this.#getDesktopElement();
    if (!desktop) return;

    const desktopRect = desktop.getBoundingClientRect();

    let left = e.clientX - desktopRect.left - this.#offsetX;
    let top = e.clientY - desktopRect.top - this.#offsetY;

    ({ left, top } = clampWindowPosition(desktop, this.#windowFrame, left, top));

    this.#windowFrame.style.left = `${left}px`;
    this.#windowFrame.style.top = `${top}px`;
  }

  #handlePointerUp(e) {
    if (!this.#isDragging) return;

    this.#isDragging = false;
    if (this.#windowTitleBar.hasPointerCapture(e.pointerId)) {
      this.#windowTitleBar.releasePointerCapture(e.pointerId);
    }
  }
}
