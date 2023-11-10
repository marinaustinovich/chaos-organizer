import { messages } from '../../../constants';
import { createElement } from '../../../utils';

export default class ModalNotification {
  constructor(message) {
    this.container = document.querySelector('.modal-window');
    this.message = message;
    this.init();
  }

  init() {
    this.drawUi();
    this.events();
  }

  drawUi() {
    const heading = createElement('p', {
      textContent: this.message,
    });

    const btnWrapper = createElement('div', { classes: ['btn-modal-wrapper'] });
    const closeButton = createElement('button', {
      classes: ['close'],
      textContent: messages.BUTTON_CLOSE,
    });
    const modalContent = createElement('div', {
      classes: ['modal-content'],
      children: [heading, btnWrapper],
    });
    const modal = createElement('div', {
      classes: ['modal-chat'],
      children: [modalContent],
    });

    btnWrapper.appendChild(closeButton);
    this.container.appendChild(modal);
    this.closeButton = closeButton;
  }

  events() {
    this.closeButton.addEventListener('click', () => this.closeModal());
  }

  closeModal() {
    this.container.innerHTML = '';
  }
}
