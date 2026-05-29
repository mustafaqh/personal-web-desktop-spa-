/** @typedef {import('./memory_model.js').MemoryCard} MemoryCard */
/** @typedef {import('./memory_config.js').MemoryLevelId} MemoryLevelId */

import { MEMORY_LEVELS, DEFAULT_MEMORY_LEVEL } from './memory_config.js';

/**
 * DOM for one Memory game instance (scoped to root).
 */
export class MemoryView {
  /** @type {HTMLElement} */
  root;
  /** @type {HTMLElement} */
  #gridEl;
  /** @type {HTMLElement} */
  #movesEl;
  /** @type {HTMLElement} */
  #pairsEl;
  /** @type {HTMLElement} */
  #scoreEl;
  /** @type {HTMLSelectElement} */
  #levelSelectEl;
  /** @type {HTMLElement} */
  #statusEl;
  /** @type {HTMLElement} */
  #winEl;
  /** @type {HTMLButtonElement} */
  #restartBtn;
  /** @type {Map<number, HTMLButtonElement>} */
  #cardButtons = new Map();

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'memory-app';
    this.root.dataset.level = DEFAULT_MEMORY_LEVEL;

    const header = document.createElement('header');
    header.className = 'memory-header';

    const controls = document.createElement('div');
    controls.className = 'memory-controls';

    const levelLabel = document.createElement('label');
    levelLabel.className = 'memory-level-label';
    levelLabel.textContent = 'Level:';

    this.#levelSelectEl = document.createElement('select');
    this.#levelSelectEl.className = 'memory-level-select';
    this.#levelSelectEl.setAttribute('aria-label', 'Difficulty level');

    for (const level of Object.values(MEMORY_LEVELS)) {
      const option = document.createElement('option');
      option.value = level.id;
      option.textContent = level.label;
      this.#levelSelectEl.appendChild(option);
    }

    this.#levelSelectEl.value = DEFAULT_MEMORY_LEVEL;
    levelLabel.appendChild(this.#levelSelectEl);

    const stats = document.createElement('div');
    stats.className = 'memory-stats';
    stats.setAttribute('aria-live', 'polite');

    this.#movesEl = document.createElement('span');
    this.#movesEl.className = 'memory-stat';
    this.#movesEl.textContent = 'Moves: 0';

    this.#pairsEl = document.createElement('span');
    this.#pairsEl.className = 'memory-stat';
    this.#pairsEl.textContent = 'Pairs left: 8';

    this.#scoreEl = document.createElement('span');
    this.#scoreEl.className = 'memory-stat';
    this.#scoreEl.textContent = 'Score: 0';

    stats.append(this.#movesEl, this.#pairsEl, this.#scoreEl);

    controls.append(levelLabel, stats);

    this.#restartBtn = document.createElement('button');
    this.#restartBtn.type = 'button';
    this.#restartBtn.className = 'memory-restart-btn';
    this.#restartBtn.textContent = 'Restart';
    this.#restartBtn.setAttribute('aria-label', 'Restart game');

    header.append(controls, this.#restartBtn);

    this.#statusEl = document.createElement('p');
    this.#statusEl.className = 'memory-status';
    this.#statusEl.setAttribute('role', 'status');
    this.#statusEl.setAttribute('aria-live', 'polite');
    this.#statusEl.textContent = 'Tab to level, Restart, or a card. On a card: arrow keys move, Enter or Space flip.';

    this.#gridEl = document.createElement('div');
    this.#gridEl.className = 'memory-grid';
    this.#gridEl.setAttribute('role', 'group');
    this.#gridEl.setAttribute('aria-label', 'Memory card grid');

    this.#winEl = document.createElement('div');
    this.#winEl.className = 'memory-win';
    this.#winEl.hidden = true;
    this.#winEl.setAttribute('role', 'alert');

    const winText = document.createElement('p');
    winText.className = 'memory-win-text';
    this.#winEl.appendChild(winText);

    this.root.append(header, this.#statusEl, this.#gridEl, this.#winEl);
  }

  /**
   * @param {number} cols
   * @param {number} rows
   * @param {MemoryLevelId} levelId
   */
  setGridLayout(cols, rows, levelId) {
    this.#gridEl.dataset.cols = String(cols);
    this.#gridEl.dataset.rows = String(rows);
    this.root.dataset.level = levelId;
  }

  /**
   * @param {MemoryCard[]} cards
   */
  renderBoard(cards) {
    this.#gridEl.replaceChildren();
    this.#cardButtons.clear();

    for (const card of cards) {
      const btn = this.#createCardButton(card);
      this.#cardButtons.set(card.index, btn);
      this.#gridEl.appendChild(btn);
    }
  }

  /**
   * @param {MemoryCard[]} cards
   */
  updateBoard(cards) {
    for (const card of cards) {
      const btn = this.#cardButtons.get(card.index);
      if (btn) {
        this.#applyCardState(btn, card);
      }
    }
  }

  /**
   * @param {MemoryCard} card
   * @returns {HTMLButtonElement}
   */
  #createCardButton(card) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'memory-card';
    btn.dataset.cardIndex = String(card.index);
    btn.tabIndex = -1;

    const face = document.createElement('span');
    face.className = 'memory-card-face';
    btn.appendChild(face);

    this.#applyCardState(btn, card);
    return btn;
  }

  /**
   * @param {HTMLButtonElement} btn
   * @param {MemoryCard} card
   */
  #applyCardState(btn, card) {
    const face = btn.querySelector('.memory-card-face');
    if (face) {
      face.textContent = card.flipped || card.matched ? card.symbol : '?';
    }

    btn.classList.toggle('is-flipped', card.flipped || card.matched);
    btn.classList.toggle('is-matched', card.matched);
    btn.disabled = card.matched;
    btn.setAttribute('aria-disabled', card.matched ? 'true' : 'false');

    btn.setAttribute(
      'aria-label',
      card.matched
        ? `Matched pair ${card.symbol}`
        : card.flipped
          ? `Card showing ${card.symbol}`
          : 'Face-down card',
    );
  }

  /**
   * @param {number} moves
   * @param {number} pairsRemaining
   * @param {number} score
   */
  updateStats(moves, pairsRemaining, score) {
    this.#movesEl.textContent = `Moves: ${moves}`;
    this.#pairsEl.textContent = `Pairs left: ${pairsRemaining}`;
    this.#scoreEl.textContent = `Score: ${score}`;
  }

  /**
   * @param {string} message
   */
  setStatus(message) {
    this.#statusEl.textContent = message;
  }

  /**
   * @param {number} moves
   * @param {number} score
   */
  showWin(moves, score) {
    const text = this.#winEl.querySelector('.memory-win-text');
    if (text) {
      text.textContent = `You won! Score: ${score} · Moves: ${moves}`;
    }
    this.#winEl.hidden = false;
    this.setStatus(`Congratulations! Final score ${score} in ${moves} moves.`);
  }

  hideWin() {
    this.#winEl.hidden = true;
    const text = this.#winEl.querySelector('.memory-win-text');
    if (text) {
      text.textContent = '';
    }
  }

  /**
   * @returns {MemoryLevelId}
   */
  getSelectedLevel() {
    return /** @type {MemoryLevelId} */ (this.#levelSelectEl.value);
  }

  /**
   * @param {MemoryLevelId} levelId
   */
  setSelectedLevel(levelId) {
    this.#levelSelectEl.value = levelId;
  }

  /**
   * @param {function} handler
   */
  onLevelChange(handler) {
    this.#levelSelectEl.addEventListener('change', handler);
  }

  /**
   * @returns {HTMLElement}
   */
  getGridElement() {
    return this.#gridEl;
  }

  /**
   * @param {Element | null} element
   * @returns {boolean}
   */
  isGridFocused(element) {
    if (!(element instanceof HTMLElement)) return false;
    return this.#gridEl.contains(element) && element.closest('[data-card-index]') !== null;
  }

  /**
   * Roving tabindex: one playable card in the tab order at a time.
   * @param {number} focusedIndex
   */
  setFocusedCardIndex(focusedIndex) {
    for (const [index, btn] of this.#cardButtons) {
      const isRovingTarget = index === focusedIndex && !btn.disabled;
      btn.tabIndex = isRovingTarget ? 0 : -1;
    }
  }

  /**
   * @param {number} index
   * @returns {HTMLButtonElement | undefined}
   */
  getCardButton(index) {
    return this.#cardButtons.get(index);
  }

  /**
   * @returns {HTMLButtonElement}
   */
  getRestartButton() {
    return this.#restartBtn;
  }
}
