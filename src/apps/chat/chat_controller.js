/**
 * Wires Chat view and model for one window instance.
 */
export class ChatController {
  #model;
  /** @type {import('./chat_view.js').ChatView} */
  #view;
  /** @type {((e: Event) => void) | null} */
  #onRootClick = null;
  /** @type {((e: KeyboardEvent) => void) | null} */
  #onRootKeydown = null;
  /** @type {((e: Event) => void) | null} */
  #onChannelChange = null;

  /**
   * @param {import('./chat_model.js').ChatModel} model
   * @param {ChatView} view
   */
  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    this.#model.on('statusChanged', ({ status }) => {
      if (!this.#view.root.isConnected) return;
      this.#view.setConnectionStatus(status);
      this.#syncComposerEnabled();
    });

    this.#model.on('messagesChanged', ({ messages }) => {
      if (!this.#view.root.isConnected) return;
      this.#view.renderMessages(messages);
    });

    this.#model.on('usernameChanged', ({ username }) => {
      if (!this.#view.root.isConnected) return;
      this.#view.setUsername(username);
      this.#view.showUsernameGate(false);
      this.#syncComposerEnabled();
    });

    this.#model.on('channelChanged', ({ channel }) => {
      if (!this.#view.root.isConnected) return;
      this.#view.setSelectedChannel(channel);
    });

    this.#bindUi();
    this.#bootstrap();
  }

  #bootstrap() {
    const hasStored = this.#model.loadStoredUsername();

    if (hasStored) {
      this.#view.setUsername(this.#model.username);
      this.#view.showUsernameGate(false);
      this.#model.connect();
    } else {
      this.#view.showUsernameGate(true);
    }

    this.#syncComposerEnabled();
    this.#view.setConnectionStatus(this.#model.status);
    this.#view.setSelectedChannel(this.#model.channel);
    this.#view.renderMessages(this.#model.messages);
  }

  #syncComposerEnabled() {
    const canSend = this.#model.hasUsername
      && this.#model.status === 'connected';
    this.#view.setComposerEnabled(canSend);
  }

  #bindUi() {
    const root = this.#view.root;

    this.#onRootClick = (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      const actionEl = target.closest('[data-action]');
      if (!actionEl || !root.contains(actionEl)) return;

      const action = actionEl.dataset.action;

      if (action === 'start-chat') {
        this.#submitGateUsername();
      } else if (action === 'send') {
        this.#sendComposerMessage();
      } else if (action === 'toggle-settings') {
        this.#view.showSettingsPanel(!this.#view.isSettingsPanelVisible());
      } else if (action === 'apply-username') {
        this.#applyUsernameChange();
      } else if (action === 'reconnect') {
        this.#model.connect();
      }
    };

    this.#onRootKeydown = (e) => {
      if (!root.contains(/** @type {Node} */ (e.target))) return;

      if (e.key === 'Enter' && !e.ctrlKey) {
        if (this.#view.isGateInput(e.target) || this.#view.isGateStartButton(e.target)) {
          e.preventDefault();
          this.#submitGateUsername();
          return;
        }
      }

      if (e.key === 'Enter' && e.ctrlKey && this.#view.isComposer(e.target)) {
        e.preventDefault();
        this.#sendComposerMessage();
      }
    };

    root.addEventListener('click', this.#onRootClick);
    root.addEventListener('keydown', this.#onRootKeydown);

    const channelSelect = this.#view.getChannelSelect();
    this.#onChannelChange = () => {
      this.#model.setChannel(channelSelect.value);
    };
    channelSelect.addEventListener('change', this.#onChannelChange);
  }

  #submitGateUsername() {
    const username = this.#view.getGateUsernameValue();
    if (!username) return;

    this.#model.setUsername(username);
    this.#view.showUsernameGate(false);
    this.#model.connect();
  }

  #applyUsernameChange() {
    const username = this.#view.getChangeUsernameValue();
    if (!username) return;

    this.#model.setUsername(username);
    this.#view.showSettingsPanel(false);
  }

  #sendComposerMessage() {
    const text = this.#view.getComposerText();
    if (!text.trim()) return;

    const sent = this.#model.sendMessage(text);
    if (sent) {
      this.#view.clearComposer();
      this.#view.focusComposer();
    }
  }

  /** Close WebSocket and remove listeners. */
  destroy() {
    if (this.#onRootClick) {
      this.#view.root.removeEventListener('click', this.#onRootClick);
    }
    if (this.#onRootKeydown) {
      this.#view.root.removeEventListener('keydown', this.#onRootKeydown);
    }
    if (this.#onChannelChange) {
      this.#view.getChannelSelect().removeEventListener('change', this.#onChannelChange);
    }
    this.#model.destroy();
  }
}
