import ModalGeo from './ModalGeo/ModalGeo';
import Post from './Post/Post';
import Actions from './Actions/Actions';
import { appendFormData } from '../../utils';
import { baseUrl } from '../../constants';
import { Emoji, FileUploader, Recorder } from '../commons';

import './chat.css';

// import mergeMessages from './mergeMessages';
// import sortMessagesByDate from './sortMessagesByDate';

export default class Chat {
  constructor(container, socket, user, posts = []) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.socket = socket;
    this.user = user;
    this.posts = posts;
    this.recorder = null;
    this.mediaType = null;
    this.mediaFile = null;
    this.uploadedFile = null;
    this.emojisElement = null;
    this.uploadElement = null;
    this.actionsContainer = null;
    this.header = null;
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
    
        </section>
        <section id="posts" class="messages"></section>
        <section id="create-post" class="create-post">
          <form name="post" id="post-form" class="message-form">
            <div class="post-container">
              <textarea id="post-content" rows="2" placeholder="Type your message here" required></textarea>
            </div>
          </form>
          <div class="preview-list"></div>
        </section>
      </div>
    `;

    this.textarea = this.container.querySelector('#post-content');
    this.postContainer = document.querySelector('.post-container');
    this.modalWindow = this.container.querySelector('.modal-window');
    this.messages = this.container.querySelector('.messages');
    this.messageForm = this.container.querySelector('.message-form');
    this.messages = this.container.querySelector('.messages');
    this.header = this.container.querySelector('.chat-header');
    this.actionsContainer = new Actions(this.header);
    this.emojisElement = new Emoji(this.postContainer);
    this.recorder = new Recorder(this.postContainer);
    this.mediaButtonWrapper = document.querySelector('.media-button-wrapper');
    this.uploadElement = new FileUploader(
      this.mediaButtonWrapper,
      this.textarea,
    );
  }

  addEvents() {
    this.textarea.addEventListener('input', () => this.changeHeightTextarea());
    this.textarea.addEventListener('keydown', (e) => this.addPost(e));
    this.textarea.addEventListener('click', () => this.closeEmojiWindow());
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

        this.mediaFile = this.recorder.getMediaFile();
        if (this.mediaFile) {
          const mediaType = this.mediaFile.type.startsWith('video/')
            ? 'video'
            : 'audio';
          post[mediaType] = this.mediaFile;
          this.recorder.reset();
          this.mediaFile = null;
        }

        this.uploadedFile = this.uploadElement.getUploadedFile();

        if (this.uploadedFile) {
          post.file = this.uploadedFile;
          this.uploadedFile = null;
          this.uploadElement.reset();
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

  static async handleSendMessage(data) {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined) {
        appendFormData(formData, key, data[key]);
      }
    });

    const resultFetch = await fetch(`${baseUrl}messages`, {
      method: 'POST',
      body: formData,
    });

    if (resultFetch.ok) {
      const newMessage = await resultFetch.json();
      this.newPost = new Post(newMessage);
    } else {
      console.error('Error:', resultFetch.status);
    }
  }
}
