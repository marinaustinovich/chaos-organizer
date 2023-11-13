import Chat from '../components/Chat/Chat';
import { ModalNotification } from '../components/commons';

class WebSocketClient {
  constructor() {
    this.socket = null;
    this.chat = null;
    this.handlers = {
      signin_response: this.handleSigninResponse,
      login_response: this.handleLoginResponse,
      new_message: this.handleNewMessage,
      reminder: this.handleReminder,
    };
  }

  async connect(type, dataForm) {
    await this.init();
    const request = { type, user: dataForm };
    this.sendMessage(request);
  }

  init() {
    return new Promise((resolve, reject) => {
      if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
        this.socket = new WebSocket('wss://back-chaos-organizer.onrender.com/');
      
        // this.socket = new WebSocket('ws://localhost:7000');
        this.addEventListeners(resolve, reject);
      } else if (this.socket.readyState === WebSocket.OPEN) {
        resolve();
      } else {
        this.socket.addEventListener('open', resolve, { once: true });
      }
    });
  }

  addEventListeners(resolve, reject) {
    this.socket.addEventListener(
      'open',
      () => {
        console.log('Connected to WebSocket server');
        resolve();
      },
      { once: true },
    );

    this.socket.addEventListener('close', WebSocketClient.handleClose);
    this.socket.addEventListener('error', (event) => {
      WebSocketClient.handleError(event);
      reject(event);
    });
    this.socket.addEventListener('message', this.handleMessage);
  }

  sendMessage(message) {
    if (this.socket.readyState === WebSocket.OPEN) {
      const requestJson = JSON.stringify(message);
      this.socket.send(requestJson);
    } else {
      console.error('WebSocket is not open. Message not sent:', message);
    }
  }

  handleMessage = (event) => {
    try {
      const response = JSON.parse(event.data);
      const handler = this.handlers[response.type];

      if (handler) {
        handler.call(this, response);
      }
    } catch (error) {
      console.error(`Error processing message: ${error}`);
    }
  };

  handleSigninResponse(response) {
    if (response.data && response.data.success) {
      const container = document.getElementById('chat-container');
      this.chat = new Chat(
        container,
        this.socket,
        response.data.user,
        response.data.messages,
      );
      this.chat.init();
    } else if (response.data && response.data.error) {
      WebSocketClient.displayError(response.data.error);
    }
  }

  handleLoginResponse(response) {
    this.handleSigninResponse(response);
  }

  static handleClose() {
    console.log('Disconnected from WebSocket server');
  }

  static handleError(event) {
    console.error(`Error: ${event.target}`);
  }

  static displayError(errorMessage) {
    document.getElementById('modal').style.display = 'block';
    const errorEl = document.querySelector('.error-container');

    errorEl.style.display = 'block';
    errorEl.innerText = errorMessage;
  }

  handleNewMessage(response) {
    if (response && response.data) {
      const newMessage = response.data;
      if (this.chat) {
        this.chat.addNewPost(newMessage);
      }
    }
  }

  handleReminder(response) {
    if (response && response.message) {
      if (Notification.permission === 'granted') {
        this.reminder = new ModalNotification(response.message);
      }
    }
  }
}

export default WebSocketClient;
