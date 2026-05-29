import { CHAT_CHANNEL_PRESETS, CHAT_DEFAULT_CHANNEL } from './chat_config.js';

/** @typedef {import('./chat_model.js').ChatMessage} ChatMessage */
/** @typedef {import('./chat_model.js').ConnectionStatus} ConnectionStatus */

const STATUS_LABELS = {
  connected: 'Connected',
  connecting: 'Connecting…',
  disconnected: 'Disconnected',
  error: 'Error',
};

/**
 * DOM for one Chat window (scoped to root).
 */
export class ChatView {
  /** @type {HTMLElement} */
  root;
  /** @type {HTMLElement} */
  #statusEl;
  /** @type {HTMLElement} */
  #usernameEl;
  /** @type {HTMLElement} */
  #messagesEl;
  /** @type {HTMLTextAreaElement} */
  #textareaEl;
  /** @type {HTMLSelectElement} */
  #channelSelectEl;
  /** @type {HTMLElement} */
  #usernameGateEl;
  /** @type {HTMLInputElement} */
  #usernameInputEl;
  /** @type {HTMLButtonElement} */
  #gateStartBtn;
  /** @type {HTMLElement} */
  #settingsPanelEl;
  /** @type {HTMLInputElement} */
  #changeUsernameInputEl;
  /** @type {HTMLButtonElement} */
  #settingsToggleBtn;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'chat-app';

    const toolbar = document.createElement('header');
    toolbar.className = 'chat-toolbar';

    this.#statusEl = document.createElement('span');
    this.#statusEl.className = 'chat-status';
    this.#statusEl.setAttribute('role', 'status');
    this.#statusEl.setAttribute('aria-live', 'polite');

    this.#settingsToggleBtn = document.createElement('button');
    this.#settingsToggleBtn.type = 'button';
    this.#settingsToggleBtn.className = 'chat-btn chat-btn-icon chat-settings-toggle';
    this.#settingsToggleBtn.dataset.action = 'toggle-settings';
    this.#settingsToggleBtn.setAttribute('aria-label', 'Chat settings');
    this.#settingsToggleBtn.setAttribute('aria-expanded', 'false');
    this.#settingsToggleBtn.textContent = '⚙';

    toolbar.append(this.#statusEl, this.#settingsToggleBtn);

    this.#settingsPanelEl = document.createElement('div');
    this.#settingsPanelEl.className = 'chat-settings';
    this.#settingsPanelEl.hidden = true;

    const channelLabel = document.createElement('label');
    channelLabel.className = 'chat-settings-label';
    channelLabel.textContent = 'Channel';

    this.#channelSelectEl = document.createElement('select');
    this.#channelSelectEl.className = 'chat-channel-select';
    this.#channelSelectEl.setAttribute('aria-label', 'Chat channel');

    for (const channel of CHAT_CHANNEL_PRESETS) {
      const option = document.createElement('option');
      option.value = channel;
      option.textContent = channel;
      this.#channelSelectEl.appendChild(option);
    }

    if (!CHAT_CHANNEL_PRESETS.includes(CHAT_DEFAULT_CHANNEL)) {
      const option = document.createElement('option');
      option.value = CHAT_DEFAULT_CHANNEL;
      option.textContent = CHAT_DEFAULT_CHANNEL;
      this.#channelSelectEl.appendChild(option);
    }

    this.#channelSelectEl.value = CHAT_DEFAULT_CHANNEL;
    channelLabel.appendChild(this.#channelSelectEl);

    this.#usernameEl = document.createElement('p');
    this.#usernameEl.className = 'chat-username-display';

    const usernameRow = document.createElement('div');
    usernameRow.className = 'chat-settings-row';

    const changeLabel = document.createElement('label');
    changeLabel.className = 'chat-settings-label';
    changeLabel.textContent = 'Username';

    this.#changeUsernameInputEl = document.createElement('input');
    this.#changeUsernameInputEl.type = 'text';
    this.#changeUsernameInputEl.className = 'chat-input';
    this.#changeUsernameInputEl.maxLength = 32;
    this.#changeUsernameInputEl.setAttribute('autocomplete', 'username');

    changeLabel.appendChild(this.#changeUsernameInputEl);

    const applyUsernameBtn = document.createElement('button');
    applyUsernameBtn.type = 'button';
    applyUsernameBtn.className = 'chat-btn chat-btn-secondary';
    applyUsernameBtn.textContent = 'Save';
    applyUsernameBtn.dataset.action = 'apply-username';

    usernameRow.append(changeLabel, applyUsernameBtn);

    const reconnectBtn = document.createElement('button');
    reconnectBtn.type = 'button';
    reconnectBtn.className = 'chat-btn chat-btn-secondary chat-reconnect-btn';
    reconnectBtn.textContent = 'Reconnect';
    reconnectBtn.dataset.action = 'reconnect';

    this.#settingsPanelEl.append(
      channelLabel,
      this.#usernameEl,
      usernameRow,
      reconnectBtn,
    );

    const body = document.createElement('div');
    body.className = 'chat-body';

    this.#messagesEl = document.createElement('ul');
    this.#messagesEl.className = 'chat-messages';
    this.#messagesEl.setAttribute('role', 'log');
    this.#messagesEl.setAttribute('aria-live', 'polite');
    this.#messagesEl.setAttribute('aria-relevant', 'additions');

    body.appendChild(this.#messagesEl);

    const composer = document.createElement('footer');
    composer.className = 'chat-composer';

    this.#textareaEl = document.createElement('textarea');
    this.#textareaEl.className = 'chat-textarea';
    this.#textareaEl.rows = 2;
    this.#textareaEl.placeholder = 'Message… (Ctrl+Enter to send)';
    this.#textareaEl.setAttribute('aria-label', 'Chat message');

    const sendBtn = document.createElement('button');
    sendBtn.type = 'button';
    sendBtn.className = 'chat-btn chat-send-btn';
    sendBtn.textContent = 'Send';
    sendBtn.dataset.action = 'send';

    composer.append(this.#textareaEl, sendBtn);

    this.#usernameGateEl = this.#buildUsernameGate();

    this.root.append(
      toolbar,
      this.#settingsPanelEl,
      body,
      composer,
      this.#usernameGateEl,
    );
  }

  /**
   * @returns {HTMLElement}
   */
  #buildUsernameGate() {
    const gate = document.createElement('div');
    gate.className = 'chat-username-gate';

    const panel = document.createElement('div');
    panel.className = 'chat-username-gate-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Choose username');

    const title = document.createElement('h3');
    title.textContent = 'Choose a username';

    const label = document.createElement('label');
    label.className = 'chat-settings-label';
    label.textContent = 'Username';

    this.#usernameInputEl = document.createElement('input');
    this.#usernameInputEl.type = 'text';
    this.#usernameInputEl.className = 'chat-input';
    this.#usernameInputEl.maxLength = 32;
    this.#usernameInputEl.required = true;
    this.#usernameInputEl.setAttribute('autocomplete', 'username');

    label.appendChild(this.#usernameInputEl);

    this.#gateStartBtn = document.createElement('button');
    this.#gateStartBtn.type = 'button';
    this.#gateStartBtn.className = 'chat-btn';
    this.#gateStartBtn.textContent = 'Join chat';
    this.#gateStartBtn.dataset.action = 'start-chat';

    panel.append(title, label, this.#gateStartBtn);
    gate.appendChild(panel);
    return gate;
  }

  /**
   * @param {ConnectionStatus} status
   */
  setConnectionStatus(status) {
    this.#statusEl.textContent = STATUS_LABELS[status] ?? status;
    this.#statusEl.dataset.status = status;
  }

  /**
   * @param {string} username
   */
  setUsername(username) {
    this.#usernameEl.textContent = username ? `Signed in as ${username}` : '';
    this.#changeUsernameInputEl.value = username;
  }

  /**
   * @param {boolean} visible
   */
  showUsernameGate(visible) {
    this.#usernameGateEl.hidden = !visible;
    if (visible) {
      this.#usernameInputEl.focus();
    }
  }

  /**
   * @param {Node | null} target
   * @returns {boolean}
   */
  isGateInput(target) {
    return target === this.#usernameInputEl;
  }

  /**
   * @param {EventTarget | null} target
   * @returns {boolean}
   */
  isGateStartButton(target) {
    return target === this.#gateStartBtn;
  }

  /**
   * @param {Node | null} target
   * @returns {boolean}
   */
  isComposer(target) {
    return target === this.#textareaEl;
  }

  /**
   * @returns {HTMLSelectElement}
   */
  getChannelSelect() {
    return this.#channelSelectEl;
  }

  /**
   * @param {boolean} visible
   */
  showSettingsPanel(visible) {
    this.#settingsPanelEl.hidden = !visible;
    this.#settingsToggleBtn.setAttribute(
      'aria-expanded',
      visible ? 'true' : 'false',
    );
    if (visible) {
      this.#changeUsernameInputEl.focus();
      this.#changeUsernameInputEl.select();
    }
  }

  /**
   * @returns {boolean}
   */
  isSettingsPanelVisible() {
    return !this.#settingsPanelEl.hidden;
  }

  /**
   * @param {ChatMessage[]} messages
   */
  renderMessages(messages) {
    this.#messagesEl.replaceChildren();

    if (messages.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'chat-empty';
      empty.textContent = 'No messages yet. Say hello!';
      this.#messagesEl.appendChild(empty);
      return;
    }

    for (const message of messages) {
      const item = document.createElement('li');
      item.className = 'chat-message';
      if (message.isOwn) {
        item.classList.add('chat-message-own');
      }

      const meta = document.createElement('div');
      meta.className = 'chat-message-meta';

      const user = document.createElement('span');
      user.className = 'chat-message-user';
      user.textContent = message.username;

      const time = document.createElement('time');
      time.className = 'chat-message-time';
      time.dateTime = message.timestamp.toISOString();
      time.textContent = this.#formatTime(message.timestamp);

      meta.append(user, time);

      const body = document.createElement('p');
      body.className = 'chat-message-text';
      body.textContent = message.text;

      item.append(meta, body);
      this.#messagesEl.appendChild(item);
    }

    this.#messagesEl.scrollTop = this.#messagesEl.scrollHeight;
  }

  /**
   * @param {Date} date
   * @returns {string}
   */
  #formatTime(date) {
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  /**
   * @returns {string}
   */
  getGateUsernameValue() {
    return this.#usernameInputEl.value.trim();
  }

  /**
   * @returns {string}
   */
  getChangeUsernameValue() {
    return this.#changeUsernameInputEl.value.trim();
  }

  /**
   * @returns {string}
   */
  getComposerText() {
    return this.#textareaEl.value;
  }

  clearComposer() {
    this.#textareaEl.value = '';
  }

  focusComposer() {
    this.#textareaEl.focus();
  }

  /**
   * @returns {string}
   */
  getSelectedChannel() {
    return this.#channelSelectEl.value;
  }

  /**
   * @param {string} channel
   */
  setSelectedChannel(channel) {
    this.#channelSelectEl.value = channel;
  }

  /**
   * @param {boolean} enabled
   */
  setComposerEnabled(enabled) {
    this.#textareaEl.disabled = !enabled;
    const sendBtn = this.root.querySelector('[data-action="send"]');
    if (sendBtn instanceof HTMLButtonElement) {
      sendBtn.disabled = !enabled;
    }
  }
}
