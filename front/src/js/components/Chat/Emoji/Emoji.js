import { createElement } from '../../../utils';
import emojis from './emojis';

import './emoji.css';

export default class Emoji {
  constructor(container) {
    this.container = container;
    this.emojiButton = null;
    this.emojiWindow = null;
    this.emojiPicker = null;
    this.textarea = null;
    this.init();
  }

  init() {
    this.createEmoji();
    this.events();
  }

  createEmoji() {
    const emojiButton = createElement('button', {
      classes: ['btn-media', 'emoji-button'],
      attributes: {
        type: 'button',
      },
    });

    const emojiButtonWrapper = createElement('div', {
      classes: ['emoji-button-wrapper'],
    });

    const emojiWindow = createElement('div', {
      classes: ['emoji-window', 'hidden'],
    });

    const emojiPicker = createElement('div', {
      classes: ['emoji-picker'],
      children:
        emojis.map((emoji) => createElement('button', {
          classes: ['emoji'],
          attributes: {
            type: 'button',
          },
          textContent: emoji,
        })),

    });

    emojiWindow.appendChild(emojiPicker);
    emojiButtonWrapper.appendChild(emojiWindow);
    emojiButtonWrapper.appendChild(emojiButton);
    this.container.insertBefore(emojiButtonWrapper, this.container.firstChild);
  }

  events() {
    this.emojiButton = this.container.querySelector('.emoji-button');
    this.emojiWindow = this.container.querySelector('.emoji-window');
    this.emojiPicker = this.container.querySelector('.emoji-picker');
    this.textarea = this.container.querySelector('#post-content');

    this.emojiButton.addEventListener('click', () => this.toggleEmojiButton());
    this.emojiPicker.addEventListener('click', (event) => this.addEmoji(event));
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

  closeEmojiWindow() {
    if (this.emojiWindow.className === 'emoji-window') {
      this.emojiWindow.classList.add('hidden');
    }
  }
}
