import { createElement } from '../../../utils';

import './dropdown.css';

export default class Dropdown {
  constructor(container, items) {
    this.container = container;
    this.items = items;
    this.moreButton = null;
    this.dropdownContent = null;
    this.init();
  }

  init() {
    this.createDropdown();
    this.events();
  }

  createDropdown() {
    const moreButton = createElement('button', {
      classes: ['btn-action', 'more-button'],
      attributes: {
        type: 'button',
      },
    });

    const dropdownContent = createElement('div', {
      classes: ['dropdown-content'],
      children: this.items.map((item) => createElement('button', {
        classes: ['dropdown-item'],
        attributes: { type: 'button' },
        textContent: item,
      })),
    });

    const dropdown = createElement('div', {
      classes: ['dropdown'],
      children: [moreButton, dropdownContent],
    });

    this.container.appendChild(dropdown);
  }

  events() {
    this.moreButton = this.container.querySelector('.more-button');
    this.dropdownContent = this.container.querySelector('.dropdown-content');

    this.moreButton.addEventListener('click', () => this.toggleDropdown());
  }

  toggleDropdown() {
    this.dropdownContent.classList.toggle('hidden');
  }
}
