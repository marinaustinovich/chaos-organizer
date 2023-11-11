import { messages } from '../../../constants';
import { createElement, isValidGeo } from '../../../utils';

import './modal-geo.css';

export default class ModalGeo {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.modal = null;
    this.addButton = null;
    this.closeButton = null;
    this.input = null;
    this.error = null;
    this.init();
  }

  init() {
    this.drawUi();
    this.events();
  }

  drawUi() {
    this.input = createElement('input', {
      classes: ['field', 'geo-input'],
      attributes: {
        type: 'text',
        id: 'geo-input',
        placeholder: messages.PLACEHOLDER_COORDS,
      },
    });

    this.modal = createElement('div', {
      classes: ['modal-chat'],
      attributes: { id: 'modal' },
      children: [
        createElement('div', {
          classes: ['modal-content'],
          children: [
            createElement('h4', { textContent: messages.ERROR_GOING_WRONG }),
            createElement('p', { textContent: messages.ERROR_NO_COORDS }),
            createElement('label', {
              attributes: { for: 'geo' },
              textContent: messages.LABEL_COORDS,
            }),
            this.input,
            createElement('div', {
              classes: ['btn-modal-wrapper'],
              children: [
                (this.closeButton = createElement('button', {
                  classes: ['close-geo'],
                  textContent: messages.BUTTON_CLOSE,
                })),
                (this.addButton = createElement('button', {
                  classes: ['add-geo'],
                  textContent: messages.BUTTON_OK,
                })),
              ],
            }),
          ],
        }),
        (this.error = createElement('div', {
          classes: ['error-container'],
          attributes: { style: 'display: none;' },
        })),
      ],
    });

    this.container.appendChild(this.modal);
  }

  events() {
    this.input.addEventListener('click', () => {
      this.input.value = '';
      this.hideError();
    });
  }

  waitForOk() {
    return new Promise((resolve) => {
      this.addButton.addEventListener('click', () => {
        const geo = this.input.value;
        if (geo) {
          const result = isValidGeo(geo);
          if (typeof result === 'string') {
            this.showError(result);
          } else {
            this.coords = result;
            this.modal.style.display = 'none';
            resolve(this.getCoords());
          }
        } else {
          this.showError(messages.ADD_USER_COORDS);
        }
      });

      this.closeButton.addEventListener('click', () => {
        this.closeModal();
        resolve(null);
      });
    });
  }

  closeModal() {
    this.modal.remove();
  }

  showError(message) {
    this.error.textContent = message;
    this.error.style.display = 'block';
  }

  hideError() {
    this.error.style.display = 'none';
  }

  getCoords() {
    return this.coords;
  }
}
