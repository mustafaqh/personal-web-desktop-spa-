/** @typedef {'easy' | 'normal' | 'hard'} MemoryLevelId */

/** @typedef {{ id: MemoryLevelId, label: string, pairs: number, cols: number, rows: number }} MemoryLevelConfig */

/** Card symbols (12 unique pairs max for Hard). */
export const MEMORY_SYMBOLS = [
  '🍎', '🍋', '🍇', '🍒', '🌸', '🌙', '⭐', '🔔', '🎵', '🎲', '🦋', '🚀',
];

/** @type {Record<MemoryLevelId, MemoryLevelConfig>} */
export const MEMORY_LEVELS = {
  easy: { id: 'easy', label: 'Easy', pairs: 4, cols: 4, rows: 2 },
  normal: { id: 'normal', label: 'Normal', pairs: 8, cols: 4, rows: 4 },
  hard: { id: 'hard', label: 'Hard', pairs: 12, cols: 4, rows: 6 },
};

/** Default difficulty. */
export const DEFAULT_MEMORY_LEVEL = 'normal';

/** @param {MemoryLevelId} levelId */
export function getMemoryLevel(levelId) {
  return MEMORY_LEVELS[levelId] ?? MEMORY_LEVELS[DEFAULT_MEMORY_LEVEL];
}
