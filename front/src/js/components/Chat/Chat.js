import ModalGeo from './ModalGeo/ModalGeo';
import ModalMedia from './media/ModalMedia';
import { startTimer, stopTimer } from '../../utils/timer';
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
      <div class="modal-window"></div>
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

    this.modalWindow = this.container.querySelector('.modal-window');
    this.messages = this.container.querySelector('.messages');
    this.messageForm = this.container.querySelector('.message-form');
    this.textarea = this.container.querySelector('#post-content');
    this.startButton = this.container.querySelector('.start-media');
    this.stopButton = this.container.querySelector('.stop-media');
    this.audioButton = this.container.querySelector('.audio-button');
    this.videoButton = this.container.querySelector('.video-button');
    this.emojiButton = this.container.querySelector('.emoji-button');
    this.emojiWindow = this.container.querySelector('.emoji-window');
    this.emojiPicker = this.container.querySelector('.emoji-picker');
  }

  addEvents() {
    this.textarea.addEventListener('input', () => this.changeHeightTextarea());
    this.textarea.addEventListener('keydown', (e) => this.addPost(e));
    this.textarea.addEventListener('click', () => this.closeEmojiWindow());
    this.audioButton.addEventListener('click', () => this.writeMedia({ audio: true, video: false }));
    this.videoButton.addEventListener('click', () => this.writeMedia({ audio: true, video: true }));
    this.startButton.addEventListener('click', () => this.startRecording());
    this.stopButton.addEventListener('click', () => this.stopRecording());
    this.emojiButton.addEventListener('click', () => this.toggleEmojiButton());
    this.emojiPicker.addEventListener('click', (event) => this.addEmoji(event));
  }

  addSavedPosts() {
    this.posts.forEach((post) => new Post(post));
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
      const geoData = await this.getGeoData();
      if (geoData) {
        const request = {
          type: 'post',
          user: {
            name: this.user.name,
            userId: this.user.id,
          },
          message: {
            text: this.textarea.value,
            location: geoData,
          },
        };

        Chat.handleSendMessage(request);
      }
      this.textarea.value = '';
    }
  }

  async getGeoData() {
    if ('geolocation' in navigator) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos.coords),
            (error) => reject(error),
          );
        });
        const coordinates = {
          latitude: position.latitude,
          longitude: position.longitude,
        };
        return coordinates;
      } catch {
        return this.showModalGeo();
      }
    } else {
      return this.showModalGeo();
    }
  }

  showModalGeo() {
    const modalGeo = new ModalGeo(this.modalWindow);

    return modalGeo.waitForOk();
  }

  writeMedia(constraints) {
    this.toggleMediaButtonVisibility();
    this.setupMediaRecorder(constraints);
  }

  toggleMediaButtonVisibility() {
    this.container.querySelector('.media-button-wrapper').style.display = 'none';
    this.container.querySelector('.media-action-wrapper').style.display = 'flex';
  }

  async setupMediaRecorder(constraints) {
    this.startButton.disabled = true;
    this.chunks = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.recorder = new MediaRecorder(stream);

      this.recorder.addEventListener('start', () => console.log('start media'));
      this.recorder.addEventListener('dataavailable', (event) => this.chunks.push(event.data));
      this.recorder.addEventListener('stop', () => this.handleRecordingStop(constraints));

      this.startButton.disabled = false;
    } catch {
      this.handleError();
    }
  }

  handleRecordingStop(constraints) {
    stopTimer('#timer');
    console.log(constraints);
    this.constraints = constraints;
  }

  handleError() {
    this.startButton.disabled = false;
    this.modalMedia = new ModalMedia(this.modalWindow);
  }

  static createMediaUrl(chunks, constraints) {
    const mediaType = constraints.video
      ? 'video/webm'
      : 'audio/ogg; codecs=opus';
    const blob = new Blob(chunks, { type: mediaType });
    return URL.createObjectURL(blob);
  }

  startRecording() {
    if (!this.recorder) {
      return;
    }

    this.startButton.disabled = true;
    this.stopButton.disabled = false;

    this.recorder.start();
    startTimer('#timer');
  }

  stopRecording() {
    this.startButton.disabled = false;
    this.stopButton.disabled = true;

    if (this.recorder && this.recorder.state !== 'inactive') {
      console.log('stop', this.recorder);
      this.recorder.stop();
    }
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

  static async handleSendMessage(dataMessage) {
    const formData = new FormData();
    formData.append('message', JSON.stringify(dataMessage));
    if (this.mediaChunks && this.mediaType) {
      let type;
      if (this.mediaType.video) {
        type = 'video';
      } else {
        type = 'audio';
      }

      const mediaFile = new File([this.chunks], 'media', {
        type: this.mediaType.type,
      });
      formData.append(type, mediaFile);
      this.chunks = [];
    }

    console.log('formData', formData);
    const resultFetch = await fetch('http://localhost:7070/messages', {
      method: 'POST',
      body: formData,
    });
    console.log('resultFetch', resultFetch);
    if (resultFetch.ok) {
      // const text = await resultFetch.text();
      // console.log(text);
      const newMessage = await resultFetch.json();
      console.log('newMessage', newMessage);
      const post = new Post(newMessage);
      console.log('post', post);
    } else {
      console.error('Error:', resultFetch.status);
    }
    const messageJson = JSON.stringify(dataMessage);
    this.socket.send(messageJson);
  }
}
