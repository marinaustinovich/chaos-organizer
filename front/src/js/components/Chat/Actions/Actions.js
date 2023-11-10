import { messages } from '../../../constants';
import { createElement } from '../../../utils';
import { Dropdown } from '../../commons';
import ModalReminder from '../ModalReminder/ModalReminder';

import './actions.css';

export default class Actions {
  constructor(container, user) {
    this.container = container;
    this.user = user;
    this.actionsContainer = null;
    this.dropdown = null;
    this.searchButton = null;
    this.addReminderButton = null;
    this.init();
  }

  init() {
    this.createActions();
    this.events();
  }

  createActions() {
    this.searchButton = createElement('button', {
      classes: ['btn-action', 'search-button'],
      attributes: {
        type: 'button',
      },
    });

    this.addReminderButton = createElement('button', {
      classes: ['btn-action', 'reminder-button'],
      attributes: {
        type: 'button',
      },
    });

    this.actionsContainer = createElement('div', {
      classes: ['actions'],
      children: [this.searchButton, this.addReminderButton],
    });

    this.dropdown = new Dropdown(this.actionsContainer, messages.DROPDOWN_ITEMS);
    this.container.append(this.actionsContainer);
  }

  events() {
    this.addReminderButton.addEventListener('click', () => this.showModalReminder());
  }

  showModalReminder() {
    this.modal = new ModalReminder(document.querySelector('.modal-window'), this.user.id);
  }
}
