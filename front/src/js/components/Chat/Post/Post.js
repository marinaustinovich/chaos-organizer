import dayjs from 'dayjs';
import { createElement, createLink } from '../../../utils';

import './post.css';

export default class Post {
  constructor(data) {
    this.data = data;
    if (this.data.video) this.mediaUrl = data.video;
    if (this.data.audio) this.mediaUrl = data.audio;

    this.userId = data.userId;
    this.post = null;
    this.posts = null;
    this.textarea = null;
    this.createPost();
  }

  createPost() {
    const date = createElement('div', {
      classes: ['post-date'],
      textContent: dayjs(this.data.date).format('HH:mm DD.MM.YY'),
    });

    const textPost = createElement('div', {
      classes: ['text-post'],
      textContent: createLink(this.data.text),
    });

    const media = this.mediaUrl
      ? this.createMediaElement()
      : document.createDocumentFragment();

    const geodata = createElement('div', {
      classes: ['geodata'],
      textContent: `[${this.data.location.latitude}, ${this.data.location.longitude}] `,
    });

    const geodataIcon = createElement('span', {
      classes: ['geodata-icon'],
    });
    geodata.appendChild(geodataIcon);

    this.post = createElement('div', {
      classes: ['post'],
      children: [date, textPost, media, geodata],
    });

    this.posts = document.getElementById('posts');
    this.textarea = document.querySelector('textarea');

    this.posts.insertBefore(this.post, this.posts.firstChild);
    this.textarea.value = '';
    Post.scrollToTop();
  }

  createMediaElement() {
    const mediaFragment = document.createDocumentFragment();

    if (this.data.video) {
      const video = createElement('video', {
        attributes: {
          src: this.mediaUrl,
          controls: '',
          crossorigin: 'anonymous',
        },
      });
      mediaFragment.appendChild(video);
    }

    if (this.data.audio) {
      const audio = createElement('audio', {
        attributes: {
          src: this.mediaUrl,
          controls: '',
          crossorigin: 'anonymous',
        },
      });
      mediaFragment.appendChild(audio);
    }

    return mediaFragment;
  }

  static scrollToTop() {
    const containerPosts = document.getElementById('posts');
    containerPosts.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
