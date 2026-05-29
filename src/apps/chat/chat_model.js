import {
  CHAT_WS_URL,
  CHAT_MESSAGE_KEY,
  CHAT_DEFAULT_CHANNEL,
  CHAT_USERNAME_STORAGE_KEY,
  CHAT_MAX_MESSAGES,
} from './chat_config.js';

/** @typedef {'connecting' | 'connected' | 'disconnected' | 'error'} ConnectionStatus */

/**
 * @typedef {object} ChatMessage
 * @property {string} id
 * @property {string} username
 * @property {string} text
 * @property {string} channel
 * @property {Date} timestamp
 * @property {boolean} isOwn
 */

/**
 * Chat state and WebSocket connection for one window instance.
 */
export class ChatModel {
  /** @type {ConnectionStatus} */
  #status = 'disconnected';
  /** @type {WebSocket | null} */
  #socket = null;
  /** @type {ChatMessage[]} */
  #messages = [];
  #username = '';
  #channel = CHAT_DEFAULT_CHANNEL;
  #messageId = 0;
  #destroyed = false;
  /** @type {Map<string, Array<function>>} */
  #listeners = new Map();

  /**
   * @returns {string}
   */
  static getStoredUsername() {
    try {
      return localStorage.getItem(CHAT_USERNAME_STORAGE_KEY)?.trim() ?? '';
    } catch {
      return '';
    }
  }

  /**
   * @param {string} username
   */
  static saveUsername(username) {
    try {
      localStorage.setItem(CHAT_USERNAME_STORAGE_KEY, username.trim());
    } catch {
      // Ignore quota / privacy errors.
    }
  }

  /**
   * @returns {ConnectionStatus}
   */
  get status() {
    return this.#status;
  }

  /**
   * @returns {string}
   */
  get username() {
    return this.#username;
  }

  /**
   * @returns {string}
   */
  get channel() {
    return this.#channel;
  }

  /**
   * @returns {readonly ChatMessage[]}
   */
  get messages() {
    return this.#messages;
  }

  /**
   * @returns {boolean}
   */
  get hasUsername() {
    return this.#username.length > 0;
  }

  /**
   * @param {string} username
   */
  setUsername(username) {
    const trimmed = username.trim();
    if (!trimmed) return;
    this.#username = trimmed;
    ChatModel.saveUsername(trimmed);
    this.#emit('usernameChanged', { username: trimmed });
  }

  /**
   * @param {string} channel
   */
  setChannel(channel) {
    const trimmed = channel.trim();
    if (!trimmed || trimmed === this.#channel) return;
    this.#channel = trimmed;
    this.#messages = [];
    this.#emit('messagesChanged', { messages: this.#messages });
    this.#emit('channelChanged', { channel: trimmed });
  }

  /**
   * Load username from storage if available.
   * @returns {boolean} Whether a username was loaded.
   */
  loadStoredUsername() {
    const stored = ChatModel.getStoredUsername();
    if (stored) {
      this.#username = stored;
      return true;
    }
    return false;
  }

  /**
   * Open WebSocket connection.
   */
  connect() {
    if (this.#destroyed) return;

    if (this.#socket) {
      const state = this.#socket.readyState;
      if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
        return;
      }
      this.#socket.close();
      this.#socket = null;
    }

    this.#setStatus('connecting');

    try {
      this.#socket = new WebSocket(CHAT_WS_URL);
    } catch {
      this.#setStatus('error');
      return;
    }

    this.#socket.addEventListener('open', () => {
      if (this.#destroyed) return;
      this.#setStatus('connected');
    });

    this.#socket.addEventListener('message', (event) => {
      if (this.#destroyed) return;
      this.#handleIncoming(event.data);
    });

    this.#socket.addEventListener('error', () => {
      if (this.#destroyed) return;
      this.#setStatus('error');
    });

    this.#socket.addEventListener('close', () => {
      if (this.#destroyed) return;
      this.#socket = null;
      if (this.#status !== 'error') {
        this.#setStatus('disconnected');
      }
    });
  }

  /**
   * @param {string} text
   * @returns {boolean}
   */
  sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || !this.hasUsername) return false;

    if (!this.#socket || this.#socket.readyState !== WebSocket.OPEN) {
      this.#setStatus('disconnected');
      return false;
    }

    const payload = {
      type: 'message',
      data: trimmed,
      username: this.#username,
      channel: this.#channel,
      key: CHAT_MESSAGE_KEY,
    };

    try {
      this.#socket.send(JSON.stringify(payload));
      // Display only when the server echoes the message (avoids duplicate entries).
      return true;
    } catch {
      this.#setStatus('error');
      return false;
    }
  }

  /** Close socket and stop updates. */
  destroy() {
    this.#destroyed = true;
    if (this.#socket) {
      this.#socket.close();
      this.#socket = null;
    }
    this.#listeners.clear();
  }

  /**
   * @param {string} eventName
   * @param {function} handler
   */
  on(eventName, handler) {
    if (!this.#listeners.has(eventName)) {
      this.#listeners.set(eventName, []);
    }
    this.#listeners.get(eventName).push(handler);
  }

  /**
   * @param {unknown} raw
   */
  #handleIncoming(raw) {
    const parsed = this.#parseIncoming(raw);
    if (!parsed) return;

    if (parsed.channel !== this.#channel) return;

    this.#addMessage({
      username: parsed.username,
      text: parsed.text,
      channel: parsed.channel,
      isOwn: parsed.username === this.#username,
      timestamp: parsed.timestamp,
    });
  }

  /**
   * @param {unknown} raw
   * @returns {{ username: string, text: string, channel: string, timestamp?: Date } | null}
   */
  #parseIncoming(raw) {
    if (typeof raw !== 'string' || !raw.trim()) return null;

    try {
      const data = JSON.parse(raw);

      if (data?.type === 'heartbeat') return null;

      const text = typeof data?.data === 'string'
        ? data.data
        : typeof data?.message === 'string'
          ? data.message
          : '';

      if (!text) return null;

      const channel = typeof data?.channel === 'string' ? data.channel : CHAT_DEFAULT_CHANNEL;
      const username = typeof data?.username === 'string'
        ? data.username
        : typeof data?.user === 'string'
          ? data.user
          : 'Unknown';

      let timestamp;
      if (data?.timestamp) {
        const parsedTime = new Date(data.timestamp);
        if (!Number.isNaN(parsedTime.getTime())) {
          timestamp = parsedTime;
        }
      }

      return { username, text, channel, timestamp };
    } catch {
      return null;
    }
  }

  /**
   * @param {{ username: string, text: string, channel: string, isOwn?: boolean, timestamp?: Date }} msg
   */
  #addMessage(msg) {
    const entry = {
      id: `msg-${++this.#messageId}`,
      username: msg.username,
      text: msg.text,
      channel: msg.channel,
      timestamp: msg.timestamp ?? new Date(),
      isOwn: Boolean(msg.isOwn),
    };

    this.#messages.push(entry);

    if (this.#messages.length > CHAT_MAX_MESSAGES) {
      this.#messages.splice(0, this.#messages.length - CHAT_MAX_MESSAGES);
    }

    this.#emit('messagesChanged', { messages: this.#messages });
  }

  /**
   * @param {ConnectionStatus} status
   */
  #setStatus(status) {
    this.#status = status;
    this.#emit('statusChanged', { status });
  }

  /**
   * @param {string} eventName
   * @param {object} payload
   */
  #emit(eventName, payload) {
    const handlers = this.#listeners.get(eventName);
    if (!handlers) return;
    for (const handler of handlers) {
      handler(payload);
    }
  }
}
