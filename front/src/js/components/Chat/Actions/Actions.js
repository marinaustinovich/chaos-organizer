import { messages } from '../../../constants';
import { createElement } from '../../../utils';
import { Dropdown } from '../../commons';

import './actions.css';

export default class Actions {
  constructor(container) {
    this.container = container;
    this.actionsContainer = null;
    this.dropdown = null;
    this.searchButton = null;
    this.init();
  }

  init() {
    this.createActions();
  }

  createActions() {
    this.searchButton = createElement('button', {
      classes: ['btn-action', 'search-button'],
      attributes: {
        type: 'button',
      },
    });

    this.actionsContainer = createElement('div', {
      classes: ['actions'],
      children: [this.searchButton],
    });

    this.dropdown = new Dropdown(this.actionsContainer, messages.DROPDOWN_ITEMS);
    this.container.append(this.actionsContainer);
  }
}
