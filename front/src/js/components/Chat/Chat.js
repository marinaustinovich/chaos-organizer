import ModalGeo from './ModalGeo/ModalGeo';
import ModalMedia from './ModalMedia/ModalMedia';
import { startTimer, stopTimer } from '../../utils';
import Post from './Post/Post';
import Emoji from './Emoji/Emoji';

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
    this.mediaChunks = [];
    this.mediaType = null;
    this.mediaFile = null;
    this.emojisElement = null;
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

    this.emojisElement = new Emoji(document.querySelector('.post-container'));
    this.modalWindow = this.container.querySelector('.modal-window');
    this.messages = this.container.querySelector('.messages');
    this.messageForm = this.container.querySelector('.message-form');
    this.textarea = this.container.querySelector('#post-content');
    this.startButton = this.container.querySelector('.start-media');
    this.stopButton = this.container.querySelector('.stop-media');
    this.audioButton = this.container.querySelector('.audio-button');
    this.videoButton = this.container.querySelector('.video-button');
  }

  addEvents() {
    this.textarea.addEventListener('input', () => this.changeHeightTextarea());
    this.textarea.addEventListener('keydown', (e) => this.addPost(e));
    this.textarea.addEventListener('click', () => this.closeEmojiWindow());
    this.audioButton.addEventListener('click', () => this.writeMedia({ audio: true, video: false }));
    this.videoButton.addEventListener('click', () => this.writeMedia({ audio: true, video: true }));
    this.startButton.addEventListener('click', () => this.startRecording());
    this.stopButton.addEventListener('click', () => this.stopRecording());
  }

  addSavedPosts() {
    this.posts.forEach((post) => new Post(post));
  }

  changeHeightTextarea() {
    this.textarea.style.height = 'auto';
    this.textarea.style.height = `${this.textarea.scrollHeight}px`;
  }

  closeEmojiWindow() {
    this.emojisElement.closeEmojiWindow();
  }

  async addPost(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const geoData = await this.getGeoData();
      if (geoData) {
        const post = {
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

        if (this.mediaFile) {
          post.message.media = this.mediaFile;
          this.mediaFile = null;
        }

        Chat.handleSendMessage(post);
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
    this.mediaType = constraints;
    this.mediaFile = Chat.createMediaFile(this.chunks, constraints);
    this.chunks = [];
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

  static createMediaFile(chunks, constraints) {
    const mediaType = constraints.video
      ? 'video/webm'
      : 'audio/ogg; codecs=opus';
    return new File(chunks, `media.${constraints.video ? 'webm' : 'ogg'}`, {
      type: mediaType,
    });
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
      this.recorder.stop();
    }
  }

  static async handleSendMessage(data) {
    const formData = new FormData();
    formData.append('message', JSON.stringify(data));
    if (data.message.media) {
      const mediaType = data.message.media.type.startsWith('video/')
        ? 'video'
        : 'audio';
      formData.append(
        mediaType,
        data.message.media,
        `media.${mediaType.split('/')[1]}`,
      );
    }

    const resultFetch = await fetch('http://localhost:7070/messages', {
      method: 'POST',
      body: formData,
    });
    console.log('resultFetch', resultFetch);
    if (resultFetch.ok) {
      const newMessage = await resultFetch.json();
      console.log('newMessage', newMessage);
      const post = new Post(newMessage);
      console.log('post', post);
    } else {
      console.error('Error:', resultFetch.status);
    }
    // const messageJson = JSON.stringify(data);
    // this.socket.send(messageJson);
  }
}
