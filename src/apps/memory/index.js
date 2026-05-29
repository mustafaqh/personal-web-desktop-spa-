import '../../../style/apps/memory.css';
import { MemoryModel } from './memory_model.js';
import { MemoryView } from './memory_view.js';
import { MemoryController } from './memory_controller.js';

/**
 * Create and mount one independent Memory game instance.
 * @returns {HTMLElement} Root element to place inside a window.
 */
export function mountMemoryApp() {
  const model = new MemoryModel();
  const view = new MemoryView();
  const controller = new MemoryController(model, view);
  const root = view.root;

  const mountObserver = new MutationObserver(() => {
    if (!root.isConnected) return;

    mountObserver.disconnect();
    requestAnimationFrame(() => {
      if (root.isConnected) {
        controller.focusFirstCard();
      }
    });
  });

  mountObserver.observe(document.body, { childList: true, subtree: true });

  return root;
}
