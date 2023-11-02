import getCurrentPositions from './geolocation/getCurrentPositions';
import ModalGeo from './geolocation/ModalGeo';
import ModalMedia from './media/ModalMedia';
import { startTimer, stopTimer } from './media/getTimeMedia';
import Post from './Post';
import './chat.css';
// import mergeMessages from './mergeMessages';
// import sortMessagesByDate from './sortMessagesByDate';

export default class Chat {
  constructor(container, socket, user, messages = []) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.socket = socket;
    this.user = user;
    this.posts = messages;
  }

  init() {
    this.drawUi();
    this.addEvents();
    this.addSavedPosts();
  }

  drawUi() {
    this.container.innerHTML = `
      <div class="chat-window">
        <section class="chat-header">
          <div class="user-info">
            <div class="user-avatar">
              <img src="${this.user.avatarURL}" alt="User Avatar">
            </div>
            <div class="user-name">${this.user.name}</div>
          </div>
          <div class="actions">
            <button class="btn-action search-button" type="button"></button>
            <div class="dropdown">
              <button class="btn-action more-button" type="button"></button>
              <div class="dropdown-content">
                <button class="dropdown-item">Clear Chat</button>
                <button class="dropdown-item">Uploaded Files</button>
                <button class="dropdown-item">Videos</button>
                <button class="dropdown-item">Audios</button>
                <button class="dropdown-item">Images</button>
                <button class="dropdown-item">Documents</button>
              </div>
            </div>
          </div>
        </section>
        <section id="posts" class="messages"></section>
        <section id="create-post" class="create-post">
          <form name="post" id="post-form" class="message-form">
            <div class="post-container">
              <div class="emoji-button-wrapper">
                <button class="btn-media emoji-button" type="button"></button>
                <div class="emoji-window hidden">
                  <div class="emoji-picker">
                    <button class="emoji" type="button">😀</button>
                    <button class="emoji" type="button">😁</button>
                    <button class="emoji" type="button">😂</button>
                    <button class="emoji" type="button">🤣</button>
                    <button class="emoji" type="button">😃</button>
                    <button class="emoji" type="button">😄</button>
                  </div>
                </div>
              </div>
              
              <textarea id="post-content" rows="2" placeholder="Type your message here" required></textarea>
              <div class="media-button-wrapper">
                <button class="btn-media upload-button" type="button"></button>
                <button class="btn-media audio-button" type="button"></button>
                <button class="btn-media video-button" type="button"></button>
              </div>
              
              <div class="media-action-wrapper">
                <button class="btn-media start-media" type="button"></button>
                <div id="timer" class="timer">00:00</div>
                <button class="btn-media stop-media" type="button"></button>
              </div>
              
            </div>
          </form>
        </section>
      </div>
    `;

    this.messages = this.container.querySelector('.messages');
  }

  addSavedPosts() {
    this.posts.forEach((post) => new Post(post));
  }

  addEvents() {
    this.container.querySelector('.message-form').addEventListener('submit', (e) => this.onSubmit(e));
    this.textarea = document.getElementById('post-content');
    const audioButton = document.querySelector('.audio-button');
    const videoButton = document.querySelector('.video-button');
    this.startButton = this.container.querySelector('.start-media');
    this.stopButton = this.container.querySelector('.stop-media');
    this.emojiButton = document.querySelector('.emoji-button');
    this.emojiWindow = document.querySelector('.emoji-window');
    this.emojiPicker = document.querySelector('.emoji-picker');

    this.startButton.addEventListener('click', () => this.startRecording());
    this.stopButton.addEventListener('click', () => this.stopRecording());
    this.textarea.addEventListener('input', () => this.changeHeightTextarea());
    this.textarea.addEventListener('keydown', (e) => this.addPost(e));
    this.textarea.addEventListener('click', () => this.closeEmojiWindow());
    audioButton.addEventListener('click', () => this.writeAudio());
    videoButton.addEventListener('click', () => this.writeVideo());
    this.emojiButton.addEventListener('click', () => this.toggleEmojiButton());
    this.emojiPicker.addEventListener('click', (event) => this.addEmoji(event));
  }

  changeHeightTextarea() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  closeEmojiWindow() {
    if (document.querySelector('.emoji-window').className === 'emoji-window') {
      this.emojiWindow.classList.add('hidden');
    }
  }

  async addPost(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const result = await this.getGeoData();

      const request = {
        type: 'post',
        user: {
          name: this.user.name,
          userId: this.user.id,
        },
        message: {
          text: this.textarea.value,
          location: result,
        },
      };

      Chat.handleSendMessage(request);
    }
  }

  async getGeoData() {
    if (navigator.geolocation) {
      return getCurrentPositions();
    }
    const modalGeo = new ModalGeo(this.container.querySelector('.modal-window'));
    return modalGeo.getCoords();
  }

  writeAudio() {
    this.toggleMediaButtonVisibility();
    this.setupMediaRecorder({ audio: true });
  }

  writeVideo() {
    this.toggleMediaButtonVisibility();
    this.setupMediaRecorder({ audio: true, video: true });
  }

  toggleMediaButtonVisibility() {
    this.container.querySelector('.media-button-wrapper').style.display = 'none';
    this.container.querySelector('.media-action-wrapper').style.display = 'flex';
  }

  toggleEmojiButton() {
    this.emojiButton.classList.toggle('active');
    this.emojiWindow.classList.toggle('hidden');
  }

  addEmoji(event) {
    if (event.target.nodeName === 'BUTTON') {
      const emoji = event.target.textContent;
      this.textarea.value += emoji;
    }
  }

  async setupMediaRecorder(constraints) {
    // Блокируем кнопку "Start" в начале функции
    this.startButton.disabled = true;
    let chunks = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.mediaRecorder = new MediaRecorder(stream);

      this.mediaRecorder.addEventListener('dataavailable', (event) => chunks.push(event.data));

      this.mediaRecorder.addEventListener('stop', async () => {
        stopTimer();

        const result = await this.getGeoData();
        const request = {
          type: 'post',
          user: {
            name: this.user.name,
            userId: this.user.id,
          },
          message: {
            text: this.textarea.value,
            location: result,
          },
        };

        Chat.handleSendMessage(request, chunks, constraints);

        chunks = [];
        this.container.querySelector('.media-button-wrapper').style.display = 'block';
        this.container.querySelector('.media-action-wrapper').style.display = 'none';
      });
      // Разблокируем кнопку "Start" после успешной инициализации mediaRecorder
      this.startButton.disabled = false;
    } catch (error) {
      console.error('Ошибка при получении доступа к микрофону или камере:', error);
      this.startButton.disabled = false;
      const modalMedia = new ModalMedia(this.container.querySelector('.modal-window'));
      console.log(modalMedia);
    }
  }

  static createMediaBlob(chunks, constraints) {
    const mediaType = constraints.video ? 'video/webm' : 'audio/ogg; codecs=opus';
    const blob = new Blob(chunks, { type: mediaType });
    console.log('blob', blob);
    return blob;
  }

  startRecording() {
    if (this.mediaRecorder) {
      this.startButton.disabled = true;
      this.stopButton.disabled = false;

      this.mediaRecorder.start();
      startTimer();
    } else {
      console.error('Ошибка: mediaRecorder не определен');
    }
  }

  stopRecording() {
    this.startButton.disabled = false;
    this.stopButton.disabled = true;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
  }

  static async handleSendMessage(dataMessage, mediaChunks = null, mediaType = null) {
    const formData = new FormData();
    formData.append('message', JSON.stringify(dataMessage));
    if (mediaChunks && mediaType) {
      let type;
      console.log('media');
      if (mediaType.video) {
        type = 'video';
      } else {
        console.log('audio');
        type = 'audio';
      }

      const mediaFile = new File([mediaChunks], 'media', { type: mediaType.type });
      console.log('mediaFile', mediaFile);
      formData.append(type, mediaFile);
    }

    console.log('formData', formData);
    const resultFetch = await fetch('http://localhost:7070/messages', {
      method: 'POST',
      body: formData,
    });
    console.log('resultFetch', resultFetch);
    if (resultFetch.ok) {
      const text = await resultFetch.text();
      console.log(text);
      // const newMessage = await resultFetch.json();
      // console.log('newMessage', newMessage);
      // const post = new Post(newMessage);
    } else {
      console.error('Error:', resultFetch.status);
    }
    // const messageJson = JSON.stringify(dataMessage);
    // this.socket.send(messageJson);
  }
}
