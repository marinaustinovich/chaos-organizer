import { createElement } from '../../../utils';

import './file-preview.css';

export default class FilePreview {
  constructor(file, onCloseCallback) {
    this.file = file;
    this.onCloseCallback = onCloseCallback;
    this.closeButton = null;
    this.previewElement = null;

    this.init();
  }

  init() {
    this.createPreview();
    this.events();
  }

  createPreview() {
    this.closeButton = createElement('span', {
      classes: ['close-preview'],
      textContent: '✕',
      attributes: {
        'aria-label': 'Close',
      },
    });

    this.nameElement = createElement('span', {
      classes: ['name-preview'],
      textContent: this.file.name,
    });

    this.previewElement = createElement('div', {
      classes: ['file-preview'],
      children: [this.nameElement, this.closeButton],
    });

    this.container = document.querySelector('.preview-list');
    this.container.append(this.previewElement);
  }

  events() {
    this.closeButton.addEventListener('click', () => this.closePreview());
  }

  closePreview() {
    if (this.onCloseCallback) {
      this.onCloseCallback();
    }
    this.container.removeChild(this.previewElement);
  }
}
