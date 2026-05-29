import '../../../style/apps/chat.css';
import { ChatModel } from './chat_model.js';
import { ChatView } from './chat_view.js';
import { ChatController } from './chat_controller.js';

/**
 * Create and mount one independent Chat app instance.
 * @returns {HTMLElement} Root element to place inside a window.
 */
export function mountChatApp() {
  const model = new ChatModel();
  const view = new ChatView();
  const controller = new ChatController(model, view);

  const root = view.root;

  const disconnectObserver = new MutationObserver(() => {
    if (!root.isConnected) {
      controller.destroy();
      disconnectObserver.disconnect();
    }
  });

  disconnectObserver.observe(document.body, { childList: true, subtree: true });

  return root;
}
