const MISMATCH_DELAY_MS = 750;

/**
 * Connects model and view for one Memory game instance.
 */
export class MemoryController {
  #model;
  /** @type {MemoryView} */
  #view;
  #mismatchTimer = null;
  /** @type {number} */
  #focusedCardIndex = 0;
  /** @type {boolean} */
  #gridHadFocus = false;
  /** @type {((e: KeyboardEvent) => void) | null} */
  #boundRootKeyDown = null;
  /** @type {((e: FocusEvent) => void) | null} */
  #boundGridFocusIn = null;

  /**
   * @param {import('./memory_model.js').MemoryModel} model
   * @param {MemoryView} view
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;
    this.#bindEvents();
    this.#syncView(true);
    this.#setFocusedCard(this.#firstPlayableIndex(), false);
  }

  /**
   * Focus the first playable card. Call once after the Memory window is in the DOM.
   */
  focusFirstCard() {
    if (!this.#view.root.isConnected) return;
    this.#setFocusedCard(this.#firstPlayableIndex(), true);
  }

  #bindEvents() {
    const root = this.#view.root;
    const grid = this.#view.getGridElement();

    root.addEventListener('click', (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      const cardBtn = target.closest('[data-card-index]');
      if (!cardBtn || !root.contains(cardBtn)) return;

      if (cardBtn instanceof HTMLButtonElement && cardBtn.disabled) return;

      const index = Number(cardBtn.getAttribute('data-card-index'));
      if (Number.isNaN(index)) return;

      this.#setFocusedCard(index, false);
      this.#handleCardActivate(index);
    });

    this.#boundRootKeyDown = (e) => this.#handleRootKeyDown(e);
    root.addEventListener('keydown', this.#boundRootKeyDown, true);

    this.#boundGridFocusIn = (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      const cardBtn = target.closest('[data-card-index]');
      if (!cardBtn || !grid.contains(cardBtn)) return;

      const index = Number(cardBtn.getAttribute('data-card-index'));
      if (!Number.isNaN(index) && !this.#model.cards[index]?.matched) {
        this.#setFocusedCard(index, false);
      }
      this.#gridHadFocus = true;
    };
    grid.addEventListener('focusin', this.#boundGridFocusIn);

    grid.addEventListener('focusout', (e) => {
      const related = /** @type {Node | null} */ (e.relatedTarget);
      if (!related || !grid.contains(related)) {
        this.#gridHadFocus = this.#view.isGridFocused(document.activeElement);
      }
    });

    this.#view.getRestartButton().addEventListener('click', () => {
      this.#restart();
    });

    this.#view.onLevelChange(() => {
      this.#clearMismatchTimer();
      this.#model.setLevel(this.#view.getSelectedLevel());
      this.#view.hideWin();
      const focusGrid = this.#gridHadFocus
        || this.#view.isGridFocused(document.activeElement);
      this.#syncView(true);
      this.#view.setStatus('Level changed. Flip two cards.');
      if (focusGrid) {
        this.#setFocusedCard(this.#firstPlayableIndex(), true);
      }
    });
  }

  /**
   * Keyboard on cards (capture on root so Space/Enter/arrows are handled reliably).
   * @param {KeyboardEvent} e
   */
  #handleRootKeyDown(e) {
    const root = this.#view.root;
    const active = document.activeElement;
    if (!(active instanceof HTMLElement) || !root.contains(active)) {
      return;
    }

    const grid = this.#view.getGridElement();
    const cardEl = active.closest('[data-card-index]');
    const onCard = Boolean(cardEl && grid.contains(cardEl));

    if (!onCard) {
      return;
    }

    const cardIndex = Number(cardEl.getAttribute('data-card-index'));
    if (Number.isNaN(cardIndex)) {
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      this.#setFocusedCard(cardIndex, false);
      this.#handleCardActivate(cardIndex);
      return;
    }

    const arrow = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!arrow.includes(e.key)) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    const startIndex = this.#getPlayableIndexes().includes(cardIndex)
      ? cardIndex
      : this.#focusedCardIndex;

    const next = this.#findNextPlayableIndex(startIndex, e.key);
    this.#setFocusedCard(next, true);
  }

  /**
   * @returns {number[]}
   */
  #getPlayableIndexes() {
    const indexes = [];
    for (const card of this.#model.cards) {
      if (!card.matched) {
        indexes.push(card.index);
      }
    }
    return indexes;
  }

  /**
   * @param {number} startIndex
   * @param {string} key
   * @returns {number}
   */
  #findNextPlayableIndex(startIndex, key) {
    const playable = this.#getPlayableIndexes();
    if (playable.length === 0) return startIndex;

    let currentPos = playable.indexOf(startIndex);
    if (currentPos < 0) {
      currentPos = 0;
    }

    if (key === 'ArrowLeft' || key === 'ArrowRight') {
      const step = key === 'ArrowRight' ? 1 : -1;
      const nextPos = (currentPos + step + playable.length) % playable.length;
      return playable[nextPos];
    }

    const cols = this.#model.columns;
    const total = this.#model.cards.length;
    const col = startIndex % cols;
    const row = Math.floor(startIndex / cols);
    const rowCount = Math.ceil(total / cols);
    const rowStep = key === 'ArrowDown' ? 1 : -1;

    for (
      let r = row + rowStep;
      r >= 0 && r < rowCount;
      r += rowStep
    ) {
      const candidate = r * cols + col;
      if (candidate < total && !this.#model.cards[candidate].matched) {
        return candidate;
      }
    }

    return startIndex;
  }

  /**
   * @returns {number}
   */
  #firstPlayableIndex() {
    const playable = this.#getPlayableIndexes();
    return playable.length > 0 ? playable[0] : 0;
  }

  /**
   * @param {number} index
   * @param {boolean} [shouldFocus]
   */
  #setFocusedCard(index, shouldFocus = true) {
    const playable = this.#getPlayableIndexes();
    let nextIndex = index;

    if (!playable.includes(nextIndex)) {
      nextIndex = playable.length > 0 ? playable[0] : 0;
    }

    this.#focusedCardIndex = nextIndex;
    this.#view.setFocusedCardIndex(nextIndex);

    if (shouldFocus) {
      requestAnimationFrame(() => {
        const btn = this.#view.getCardButton(nextIndex);
        if (btn && !btn.disabled) {
          btn.focus({ preventScroll: true });
          this.#gridHadFocus = true;
        }
      });
    }
  }

  /**
   * @param {number} index
   */
  #handleCardActivate(index) {
    if (this.#model.isInputLocked) return;

    const card = this.#model.cards[index];
    if (!card || card.matched) return;

    if (!this.#getPlayableIndexes().includes(index)) return;

    const result = this.#model.flipCard(index);
    if (!result.ok) return;

    this.#gridHadFocus = true;
    this.#focusedCardIndex = index;
    this.#syncView();

    if (result.mismatch && result.pair) {
      this.#view.setStatus('No match (−2 score). Cards will flip back.');
      this.#clearMismatchTimer();
      this.#mismatchTimer = window.setTimeout(() => {
        this.#model.clearMismatch();
        this.#syncView();
        this.#view.setStatus('Flip two cards. Tab to a card, then use arrow keys and Enter or Space.');
        if (this.#gridHadFocus) {
          this.#setFocusedCard(this.#focusedCardIndex, true);
        }
      }, MISMATCH_DELAY_MS);
      return;
    }

    if (result.match) {
      this.#view.setStatus('Match found (+10 score)!');
      if (result.win) {
        this.#view.showWin(this.#model.moves, this.#model.score);
        this.#gridHadFocus = false;
        this.#view.getRestartButton().focus({ preventScroll: true });
        return;
      }
      if (this.#model.cards[this.#focusedCardIndex]?.matched) {
        this.#setFocusedCard(this.#firstPlayableIndex(), true);
      } else if (this.#gridHadFocus) {
        this.#setFocusedCard(this.#focusedCardIndex, true);
      }
      return;
    }

    this.#view.setStatus('Choose a second card.');
    if (this.#gridHadFocus) {
      this.#setFocusedCard(this.#focusedCardIndex, true);
    }
  }

  #restart() {
    this.#clearMismatchTimer();
    this.#model.reset();
    this.#view.hideWin();
    this.#view.setSelectedLevel(this.#model.levelId);
    this.#syncView(true);
    this.#view.setStatus('New game started. Flip two cards.');
    this.#gridHadFocus = true;
    this.#setFocusedCard(this.#firstPlayableIndex(), true);
  }

  /**
   * @param {boolean} [fullRender]
   */
  #syncView(fullRender = false) {
    const shouldRestoreFocus = this.#gridHadFocus;

    const { cols, rows, id } = this.#model.level;
    this.#view.setGridLayout(cols, rows, id);
    this.#view.setSelectedLevel(this.#model.levelId);

    if (fullRender) {
      this.#view.renderBoard(this.#model.cards);
    } else {
      this.#view.updateBoard(this.#model.cards);
    }

    if (!this.#getPlayableIndexes().includes(this.#focusedCardIndex)) {
      this.#focusedCardIndex = this.#firstPlayableIndex();
    }

    this.#view.setFocusedCardIndex(this.#focusedCardIndex);
    this.#view.updateStats(this.#model.moves, this.#model.pairsRemaining, this.#model.score);

    if (shouldRestoreFocus) {
      this.#setFocusedCard(this.#focusedCardIndex, true);
    }
  }

  #clearMismatchTimer() {
    if (this.#mismatchTimer !== null) {
      window.clearTimeout(this.#mismatchTimer);
      this.#mismatchTimer = null;
    }
  }
}
