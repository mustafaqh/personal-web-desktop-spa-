/** WebSocket endpoint for the course message app. */
export const CHAT_WS_URL = 'wss://courselab.lnu.se/message-app/socket';

/** API key required on outgoing messages. */
export const CHAT_MESSAGE_KEY = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd';

/** Default channel name. */
export const CHAT_DEFAULT_CHANNEL = 'my, not so secret, channel';

/** localStorage key for persisted username across windows and reloads. */
export const CHAT_USERNAME_STORAGE_KEY = 'pwd-chat-username';

/** Maximum messages kept per Chat window instance (since that window was opened). */
export const CHAT_MAX_MESSAGES = 20;

/** Preset channels for the channel selector. */
export const CHAT_CHANNEL_PRESETS = [
  CHAT_DEFAULT_CHANNEL,
  'general',
  'lobby',
];
