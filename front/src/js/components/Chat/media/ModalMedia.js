import { messages } from '../../../constants';
import createElement from '../../../utils/createDOM';

export default class ModalMedia {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.init();
  }

  init() {
    this.drawUi();
    this.events();
  }

  drawUi() {
    const heading = createElement('h4', { textContent: messages.ERROR_GOING_WRONG });
    const paragraph1 = createElement('p', { textContent: messages.ERROR_MEDIA_PERMISSION });
    const paragraph2 = createElement('p', { textContent: messages.LABEL_MEDIA });
    const btnWrapper = createElement('div', { classes: ['btn-modal-wrapper'] });
    const closeButton = createElement('button', { classes: ['close'], textContent: messages.BUTTON_CLOSE });
    const modalContent = createElement('div', { classes: ['modal-content'], children: [heading, paragraph1, paragraph2, btnWrapper] });
    const modal = createElement('div', { classes: ['modal-chat'], children: [modalContent] });

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
