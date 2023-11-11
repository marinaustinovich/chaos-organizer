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
    this.moreButton = createElement('button', {
      classes: ['btn-action', 'more-button'],
      attributes: {
        type: 'button',
      },
    });

    this.dropdownContent = createElement('div', {
      classes: ['dropdown-content'],
      children: this.items.map((item) => {
        const button = createElement('button', {
          classes: ['dropdown-item'],
          attributes: { type: 'button' },
          textContent: item.text,
        });

        if (item.onClick && typeof item.onClick === 'function') {
          button.addEventListener('click', item.onClick);
        }

        return button;
      }),
    });

    const dropdown = createElement('div', {
      classes: ['dropdown'],
      children: [this.moreButton, this.dropdownContent],
    });

    this.container.appendChild(dropdown);
  }

  events() {
    this.moreButton.addEventListener('click', () => this.toggleDropdown());
  }

  toggleDropdown() {
    this.dropdownContent.classList.toggle('hidden');
  }
}
