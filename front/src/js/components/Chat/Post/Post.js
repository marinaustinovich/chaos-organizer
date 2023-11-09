import dayjs from 'dayjs';
import { createElement, createLink } from '../../../utils';

import './post.css';

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

    const file = this.fileSrc
      ? this.createFileElement()
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
      children: [date, textPost, file, media, geodata],
    });

    this.posts = document.getElementById('posts');

    this.posts.insertBefore(this.post, this.posts.firstChild);
    document.querySelector('textarea').value = '';
    document.querySelector('.preview-list').innerHTML = '';
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

  createFileElement() {
    const fileFragment = document.createDocumentFragment();

    if (this.data.file) {
      const fileExtension = this.data.file.split('.').pop().toLowerCase();
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'ico', 'webp'];

      if (imageExtensions.includes(fileExtension)) {
        const image = createElement('img', {
          classes: ['post-image'],
          attributes: {
            src: this.data.file,
            alt: 'Uploaded image',
          },
        });
        fileFragment.appendChild(image);
      } else if (fileExtension === 'pdf') {
        const pdf = createElement('embed', {
          classes: ['post-pdf'],
          attributes: {
            src: this.data.file,
            type: 'application/pdf',
          },
        });
        fileFragment.appendChild(pdf);
      }
    }

    return fileFragment;
  }

  static scrollToTop() {
    const containerPosts = document.getElementById('posts');
    containerPosts.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
