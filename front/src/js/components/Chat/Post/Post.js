import dayjs from 'dayjs';
import { createElement, createLink, getFileNameWithoutExtension } from '../../../utils';

import './post.css';
import imageExtensions from './image-extensions';
import { baseUrl, mediaTypes } from '../../../constants';

export default class Post {
  constructor(data) {
    this.data = data;
    if (this.data.video) this.mediaUrl = data.video;
    if (this.data.audio) this.mediaUrl = data.audio;
    if (this.data.file) this.fileSrc = data.file;

    this.userId = data.userId;
    this.post = null;
    this.posts = null;
    this.createPost();
  }

  createPost() {
    const date = createElement('div', { classes: ['post-date'], textContent: dayjs(this.data.date).format('HH:mm DD.MM.YY') });
    const textPost = createElement('div', { classes: ['text-post'], textContent: createLink(this.data.text) });
    const media = this.createMediaElement();
    const file = this.createFileElement();
    const geodata = this.createGeodataElement();

    this.post = createElement('div', { classes: ['post'], children: [date, textPost, file, media, geodata] });
    this.posts = document.getElementById('posts');
    this.posts.insertBefore(this.post, this.posts.firstChild);

    Post.clearForm();
    Post.scrollToTop();
  }

  createMediaElement() {
    const mediaFragment = document.createDocumentFragment();

    if (this.data.video || this.data.audio) {
      const type = this.data.video ? mediaTypes.VIDEO : mediaTypes.AUDIO;
      const mediaElement = createElement(type, {
        attributes: {
          src: `${baseUrl}${this.data[type]}`,
          controls: '',
          crossorigin: 'anonymous',
        },
      });
      mediaFragment.appendChild(mediaElement);
    }

    return mediaFragment;
  }

  createFileElement() {
    const fileFragment = document.createDocumentFragment();

    if (this.data.file) {
      const fileExtension = this.data.file.split('.').pop().toLowerCase();

      if (imageExtensions.includes(fileExtension)) {
        const image = createElement('img', {
          classes: ['post-image'],
          attributes: { src: `${baseUrl}${this.data.file}`, alt: getFileNameWithoutExtension(this.data.file) },
        });
        fileFragment.appendChild(image);
      }
      if (fileExtension === mediaTypes.PDF) {
        const pdf = createElement('embed', {
          classes: ['post-pdf'],
          attributes: { src: `${baseUrl}${this.data.file}`, type: 'application/pdf' },
        });
        fileFragment.appendChild(pdf);
      }
    }

    return fileFragment;
  }

  createGeodataElement() {
    const geodata = createElement('div', { classes: ['geodata'], textContent: `[${this.data.location.latitude}, ${this.data.location.longitude}] ` });
    const geodataIcon = createElement('span', { classes: ['geodata-icon'] });
    geodata.appendChild(geodataIcon);
    return geodata;
  }

  static clearForm() {
    document.querySelector('textarea').value = '';
    document.querySelector('.preview-list').innerHTML = '';
  }

  static scrollToTop() {
    const containerPosts = document.getElementById('posts');
    containerPosts.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
