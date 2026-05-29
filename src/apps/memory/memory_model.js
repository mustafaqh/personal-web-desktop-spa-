import {
  DEFAULT_MEMORY_LEVEL,
  MEMORY_SYMBOLS,
  getMemoryLevel,
} from './memory_config.js';

/** @typedef {import('./memory_config.js').MemoryLevelId} MemoryLevelId */

/**
 * @typedef {{ index: number, pairId: number, symbol: string, flipped: boolean, matched: boolean }} MemoryCard
 */

/**
 * Game state and rules for one Memory instance.
 */
export class MemoryModel {
  /** @type {MemoryCard[]} */
  cards = [];
  moves = 0;
  score = 0;
  /** @type {MemoryLevelId} */
  levelId = DEFAULT_MEMORY_LEVEL;
  /** @type {number[]} */
  #flippedIndices = [];
  #lockInput = false;
  won = false;

  constructor() {
    this.reset();
  }

  /** @returns {import('./memory_config.js').MemoryLevelConfig} */
  get level() {
    return getMemoryLevel(this.levelId);
  }

  /** @returns {number} */
  get columns() {
    return this.level.cols;
  }

  /** @returns {number} */
  get rows() {
    return this.level.rows;
  }

  /** @returns {number} */
  get pairsRemaining() {
    const unmatched = this.cards.filter((c) => !c.matched).length;
    return unmatched / 2;
  }

  /** @returns {boolean} */
  get isInputLocked() {
    return this.#lockInput || this.won;
  }

  /**
   * Change difficulty and start a new game in this window only.
   * @param {MemoryLevelId} levelId
   */
  setLevel(levelId) {
    this.levelId = getMemoryLevel(levelId).id;
    this.reset();
  }

  /** Shuffle deck and reset counters for the current level. */
  reset() {
    const { pairs } = this.level;
    const deck = [];

    for (let pairId = 0; pairId < pairs; pairId += 1) {
      const symbol = MEMORY_SYMBOLS[pairId];
      deck.push({ pairId, symbol });
      deck.push({ pairId, symbol });
    }

    this.#shuffle(deck);

    this.cards = deck.map((card, index) => ({
      index,
      pairId: card.pairId,
      symbol: card.symbol,
      flipped: false,
      matched: false,
    }));

    this.moves = 0;
    this.score = 0;
    this.#flippedIndices = [];
    this.#lockInput = false;
    this.won = false;
  }

  /**
   * Flip a card by index.
   * @param {number} index
   * @returns {{ ok: boolean, mismatch?: boolean, match?: boolean, win?: boolean, pair?: number[] }}
   */
  flipCard(index) {
    if (this.isInputLocked) {
      return { ok: false };
    }

    const card = this.cards[index];
    if (!card || card.matched || card.flipped) {
      return { ok: false };
    }

    card.flipped = true;
    this.#flippedIndices.push(index);

    if (this.#flippedIndices.length < 2) {
      return { ok: true };
    }

    this.moves += 1;

    const [first, second] = this.#flippedIndices;
    const firstCard = this.cards[first];
    const secondCard = this.cards[second];

    if (firstCard.pairId === secondCard.pairId) {
      firstCard.matched = true;
      secondCard.matched = true;
      this.#flippedIndices = [];
      this.score += 10;
      this.won = this.cards.every((c) => c.matched);
      return { ok: true, match: true, win: this.won };
    }

    this.score = Math.max(0, this.score - 2);
    this.#lockInput = true;
    return { ok: true, mismatch: true, pair: [first, second] };
  }

  /** Hide the two currently mismatched face-up cards. */
  clearMismatch() {
    for (const index of this.#flippedIndices) {
      const card = this.cards[index];
      if (card && !card.matched) {
        card.flipped = false;
      }
    }
    this.#flippedIndices = [];
    this.#lockInput = false;
  }

  /**
   * @template T
   * @param {T[]} array
   */
  #shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
