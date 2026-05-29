/** Movement/placement margins relative to the #desktop container. */
export const DESKTOP_BOUNDARY = {
  margin: 12,
  taskbarReserve: 120,
};

/**
 * Clamp window position so the title bar stays inside the desktop (above the dock).
 * Coordinates are relative to the desktop container (offsetParent).
 * @param {HTMLElement} desktopEl
 * @param {HTMLElement} windowEl
 * @param {number} left
 * @param {number} top
 * @returns {{ left: number, top: number }}
 */
export function clampWindowPosition(desktopEl, windowEl, left, top) {
  const { margin, taskbarReserve } = DESKTOP_BOUNDARY;

  const desktopWidth = desktopEl.clientWidth;
  const desktopHeight = desktopEl.clientHeight;
  const windowWidth = windowEl.offsetWidth;
  const windowHeight = windowEl.offsetHeight;

  const titleBarEl = windowEl.querySelector('.window-titlebar');
  const titleBarHeight = titleBarEl instanceof HTMLElement
    ? titleBarEl.offsetHeight
    : 40;

  const minLeft = margin;
  const minTop = margin;

  const maxLeft = Math.max(minLeft, desktopWidth - windowWidth - margin);

  const availableHeight = desktopHeight - taskbarReserve;
  const maxTopKeepWhole = availableHeight - windowHeight - margin;
  const maxTopKeepTitle = availableHeight - titleBarHeight - margin;
  const maxTop = Math.max(minTop, Math.max(maxTopKeepWhole, maxTopKeepTitle));

  return {
    left: Math.min(Math.max(left, minLeft), maxLeft),
    top: Math.min(Math.max(top, minTop), maxTop),
  };
}
