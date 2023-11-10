import dayjs from 'dayjs';
import { baseUrl, messages } from '../../../constants';
import { createElement, isValidTimeFormat } from '../../../utils';
import { ModalNotification } from '../../commons';

import './modal-reminder.css';

export default class ModalReminder {
  constructor(container, userId) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.userId = userId;
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
    this.timeInput = createElement('input', {
      classes: ['time-input'],
      attributes: {
        type: 'text',
        id: 'time-input',
        placeholder: messages.PLACEHOLDER_TIME,
      },
    });
    this.textInput = createElement('input', {
      classes: ['text-input'],
      attributes: {
        type: 'text',
        id: 'text-input',
        placeholder: messages.PLACEHOLDER_TEXT,
      },
    });

    this.modal = createElement('div', {
      classes: ['modal-chat'],
      attributes: { id: 'modal' },
      children: [
        createElement('div', {
          classes: ['modal-content'],
          children: [
            createElement('h4', { textContent: messages.LABEL_REMINDER }),
            createElement('label', {
              attributes: { for: 'time-input' },
              textContent: messages.LABEL_TIME,
              children: [this.timeInput],
            }),

            createElement('label', {
              attributes: { for: 'text-input' },
              textContent: messages.LABEL_TEXT,
              children: [this.textInput],
            }),
            createElement('div', {
              classes: ['btn-modal-wrapper'],
              children: [
                (this.closeButton = createElement('button', {
                  classes: ['close-reminder'],
                  textContent: messages.BUTTON_CLOSE,
                })),
                (this.addButton = createElement('button', {
                  classes: ['add-reminder'],
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
    this.textInput.addEventListener('click', () => this.hideError());
    this.timeInput.addEventListener('click', () => this.hideError());
    this.addButton.addEventListener('click', () => this.addReminder());
    this.closeButton.addEventListener('click', () => this.closeModal());
  }

  async addReminder() {
    try {
      const time = this.timeInput.value;
      const message = this.textInput.value;

      if (!time || !message) {
        this.showError(messages.ERROR_EMPTY_INPUT);
        return;
      }

      if (!isValidTimeFormat(time)) {
        this.showError(messages.INVALID_INPUT_FORMAT);
        return;
      }

      const formattedTime = dayjs(time, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DDTHH:mm:ss');

      const response = await fetch(`${baseUrl}addReminder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: this.userId,
          time: formattedTime,
          message,
        }),
      });

      if (!response.ok) {
        this.modal = new ModalNotification(messages.ERROR_GOING_WRONG);
      } else {
        const data = await response.json();

        this.modal = new ModalNotification(data.message);
      }
    } catch {
      this.modal = new ModalNotification(messages.ERROR_GOING_WRONG);
    }
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
}
