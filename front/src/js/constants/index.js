import messages from './messages.json';
import formId from './formId.json';
import mediaTypes from './mediaTypes.json';

// const baseUrl = 'http://localhost:7000/';

// TODO production
const path = 'back-chaos-organizer.onrender.com/';
const WebSocketBaseUrl = `wss://${path}`;
const baseUrl = `https://${path}`;

export {
  messages, formId, mediaTypes, baseUrl, WebSocketBaseUrl,
};
