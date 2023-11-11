import debounce from 'lodash/debounce';
import { baseUrl, messages } from '../../../constants';
import { createElement } from '../../../utils';
import { Dropdown, ModalNotification } from '../../commons';
import ModalReminder from '../ModalReminder/ModalReminder';

import './actions.css';

export default class Actions {
  constructor(container, user, onSearchResults) {
    this.container = container;
    this.user = user;
    this.onSearchResults = onSearchResults;
    this.actionsContainer = null;
    this.dropdown = null;
    this.searchButton = null;
    this.addReminderButton = null;
    this.searchInput = null;
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

    this.searchInput = createElement('input', {
      classes: ['search-input', 'field', 'hidden'],
      attributes: {
        type: 'text',
        id: 'search-input',
        placeholder: messages.PLACEHOLDER_TEXT,
      },
    });

    this.actionsContainer = createElement('div', {
      classes: ['actions'],
      children: [this.searchInput, this.searchButton, this.addReminderButton],
    });

    this.dropdown = new Dropdown(this.actionsContainer, messages.DROPDOWN_ITEMS);
    this.container.append(this.actionsContainer);
  }

  events() {
    this.addReminderButton.addEventListener('click', () => this.showModalReminder());
    this.searchButton.addEventListener('click', () => this.showSearchInput());
    this.searchInput.addEventListener('input', this.searchPosts);
  }

  showModalReminder() {
    this.modal = new ModalReminder(document.querySelector('.modal-window'), this.user.id);
  }

  showSearchInput() {
    this.searchInput.classList.toggle('hidden');
  }

  searchPosts = debounce(async () => {
    const searchText = this.searchInput.value;

    try {
      const response = await fetch(`${baseUrl}messages?userId=${this.user.id}&text=${encodeURIComponent(searchText)}`);
      if (response.ok) {
        const searchResults = await response.json();
        this.onSearchResults(searchResults);
      }
    } catch (error) {
      this.modalNotification = new ModalNotification(messages.ERROR_GOING_WRONG);
    }
  }, 300);
}
