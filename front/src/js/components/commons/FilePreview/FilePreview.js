import { createElement } from '../../../utils';

import './file-preview.css';

export default class FilePreview {
  constructor(file) {
    this.file = file;
    this.closeButton = null;
    this.preElement = null;

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

    this.preElement = createElement('div', {
      classes: ['file-preview'],
      children: [this.nameElement, this.closeButton],
    });

    this.container = document.querySelector('.preview-list');
    this.container.append(this.preElement);
  }

  events() {
    this.closeButton.addEventListener('click', () => this.closePreview());
  }

  closePreview() {
    this.container.removeChild(this.preElement);
  }
}
