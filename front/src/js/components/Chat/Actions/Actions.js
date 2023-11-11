import debounce from 'lodash/debounce';
import { baseUrl, mediaTypes, messages } from '../../../constants';
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
    this.searchButton = Actions.createButton('search-button', 'button');
    this.addReminderButton = Actions.createButton('reminder-button', 'button');

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

    this.dropdownItems = [
      {
        text: messages.DROPDOWN_ITEMS.CLEAR_CHAT,
        onClick: () => this.clearChat(),
      },
      {
        text: messages.DROPDOWN_ITEMS.UPLOADED_FILES,
        onClick: () => this.onFilter(mediaTypes.FILE),
      },
      {
        text: messages.DROPDOWN_ITEMS.VIDEOS,
        onClick: () => this.onFilter(mediaTypes.VIDEO),
      },
      {
        text: messages.DROPDOWN_ITEMS.AUDIOS,
        onClick: () => this.onFilter(mediaTypes.AUDIO),
      },
      {
        text: messages.DROPDOWN_ITEMS.CLEAR_FILTERS,
        onClick: () => this.onFilter(),
      },
    ];

    this.dropdown = new Dropdown(this.actionsContainer, this.dropdownItems);
    this.container.append(this.actionsContainer);
  }

  static createButton(className, type) {
    return createElement('button', { classes: ['btn-action', className], attributes: { type } });
  }

  events() {
    this.addReminderButton.addEventListener('click', () => this.showModalReminder());
    this.searchButton.addEventListener('click', () => this.showSearchInput());
    this.searchInput.addEventListener('input', this.searchPosts);
  }

  showModalReminder() {
    this.modal = new ModalReminder(
      document.querySelector('.modal-window'),
      this.user.id,
    );
  }

  showSearchInput() {
    this.searchInput.classList.toggle('hidden');
  }

  searchPosts = debounce(async () => {
    const searchText = this.searchInput.value;

    try {
      const response = await fetch(
        `${baseUrl}messages?userId=${this.user.id}&text=${encodeURIComponent(
          searchText,
        )}`,
      );
      if (response.ok) {
        const searchResults = await response.json();
        this.onSearchResults(searchResults);
      } else {
        this.handleResponseError('error');
      }
    } catch (error) {
      this.handleResponseError(error);
    }
  }, 300);

  async onFilter(params) {
    const url = params ? `${baseUrl}messages?userId=${this.user.id}&${params}=true` : `${baseUrl}messages?userId=${this.user.id}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const searchResults = await response.json();
        this.onSearchResults(searchResults);
      } else {
        this.handleResponseError('error');
      }
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  async clearChat() {
    try {
      const response = await fetch(`${baseUrl}messages?userId=${this.user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        this.onSearchResults([]);
      } else {
        this.handleResponseError('error');
      }
    } catch (error) {
      this.handleResponseError(error);
    }
  }

  handleResponseError(error) {
    console.error(error);
    this.modalNotification = new ModalNotification(messages.ERROR_GOING_WRONG);
  }
}
