import ModalGeo from './ModalGeo/ModalGeo';
import Post from './Post/Post';
import UserInfo from './UserInfo/UserInfo';
import Actions from './Actions/Actions';
import { appendFormData, createElement } from '../../utils';
import { baseUrl, messages } from '../../constants';
import {
  Emoji, FileUploader, Recorder, ModalNotification,
} from '../commons';

import './chat.css';

export default class Chat {
  constructor(container, socket, user, posts = []) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.socket = socket;
    this.user = user;
    this.posts = posts;
    this.handleSearchText = this.handleSearchText.bind(this);
    this.newMessage = null;
    this.recorder = null;
    this.mediaType = null;
    this.mediaFile = null;
    this.uploadedFile = null;
    this.emojisElement = null;
    this.uploadElement = null;
    this.actionsContainer = null;
    this.chatHeader = null;
    this.userInfoElement = null;
    this.postContainer = null;
    this.modalWindow = null;
    this.modalNotification = null;
  }

  init() {
    this.drawUi();
    this.initNotification();
    this.addEvents();
    this.addSavedPosts();
  }

  initNotification() {
    if (Notification.permission === 'denied') {
      this.showEnableNotificationsMessage();
    } else if (Notification.permission !== 'granted') {
      this.requestNotificationPermission();
    }
  }

  drawUi() {
    this.modalWindow = createElement('div', { classes: ['modal-window'] });
    const chatWindow = createElement('div', { classes: ['chat-window'] });
    this.chatHeader = createElement('section', { classes: ['chat-header'] });
    this.messagesSection = createElement('section', {
      classes: ['messages'],
      attributes: { id: 'posts' },
    });
    const createPostSection = this.createPostSection();

    chatWindow.append(this.chatHeader, this.messagesSection, createPostSection);
    this.container.append(this.modalWindow, chatWindow);
    this.userInfoElement = new UserInfo(this.chatHeader, this.user);
    this.actionsContainer = new Actions(this.chatHeader, this.user, this.handleSearchText);
    this.emojisElement = new Emoji(createPostSection);
    this.recorder = new Recorder(createPostSection);
    this.uploadElement = new FileUploader(
      createPostSection.querySelector('.media-button-wrapper'),
      this.textarea,
    );
  }

  createPostSection() {
    this.textarea = createElement('textarea', {
      classes: ['field'],
      attributes: {
        id: 'post-content',
        rows: '2',
        placeholder: 'Type your message here',
        required: true,
      },
    });

    const form = createElement('form', {
      classes: ['message-form'],
      attributes: { name: 'post', id: 'post-form' },
      children: [this.textarea],
    });

    const previewList = createElement('div', { classes: ['preview-list'] });
    this.postContainer = createElement('div', {
      classes: ['post-container'],
      children: [form, previewList],
    });

    const createPostSection = createElement('section', {
      classes: ['create-post'],
      attributes: { id: 'create-post' },
      children: [this.postContainer],
    });

    return createPostSection;
  }

  addEvents() {
    this.textarea.addEventListener('input', () => this.changeHeightTextarea());
    this.textarea.addEventListener('keydown', (e) => this.addPost(e));
    this.textarea.addEventListener('click', () => this.closeEmojiWindow());
    this.messagesSection.addEventListener('scroll', () => this.handleScroll());
  }

  addSavedPosts(isNewPost = false) {
    this.messagesSection.innerHTML = '';
    this.posts.forEach((post) => new Post(post, isNewPost));
  }

  requestNotificationPermission() {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        this.modalNotification = new ModalNotification(messages.NOTIFICATION_REMINDER);
      }
    });
  }

  showEnableNotificationsMessage() {
    this.modalNotification = new ModalNotification(messages.ERROR_REMINDER_PERMISSION);
  }

  addNewPost(newMessage) {
    this.posts.push(newMessage);
    this.newPost = new Post(newMessage, true);
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
      this.newMessage = await resultFetch.json();
    } else {
      console.error('Error:', resultFetch.status);
      this.modalNotification = new ModalNotification(messages.ERROR_GOING_WRONG);
    }
  }

  async handleScroll() {
    const isTop = this.messagesSection.scrollTop === 0;

    if (isTop) {
      await this.loadMoreMessages();
    }
  }

  async loadMoreMessages() {
    const lastMessageDate = this.posts.length > 0 ? this.posts[0].date : null;

    try {
      const response = await fetch(`${baseUrl}messages?userId=${this.user.id}&lastMessageDate=${lastMessageDate}`);
      if (response.ok) {
        const olderPosts = await response.json();
        const nonDuplicatePosts = olderPosts.filter((o) => !this.posts.find((p) => p.id === o.id));

        this.posts.unshift(...nonDuplicatePosts);
        this.addSavedPosts();
      }
    } catch (error) {
      this.modalNotification = new ModalNotification(messages.ERROR_GOING_WRONG);
    }
  }

  async handleSearchText(searchResults) {
    this.posts = searchResults;
    this.addSavedPosts(true);
  }
}
