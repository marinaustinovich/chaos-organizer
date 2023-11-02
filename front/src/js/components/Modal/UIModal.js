import { formId } from '../../constants';

class UIModal {
  constructor(container) {
    this.container = container;
  }

  createModal() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'modal';

    const card = document.createElement('div');
    card.className = 'card registration';
    card.style.width = '18rem';
    card.style.height = '24rem';

    const navTabs = UIModal.createNavTabs();
    const tabContent = UIModal.createTabContent();

    card.appendChild(navTabs);
    card.appendChild(tabContent);
    modal.appendChild(card);
    this.container.appendChild(modal);

    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    this.container.appendChild(errorContainer);
  }

  static createNavTabs() {
    const ul = document.createElement('ul');
    ul.className = 'nav nav-tabs';
    ul.id = 'myTab';
    ul.role = 'tablist';

    const loginTab = UIModal.createNavItem('Log in', 'home');
    const signinTab = UIModal.createNavItem('Sign in', 'profile');

    ul.appendChild(loginTab);
    ul.appendChild(signinTab);

    return ul;
  }

  static createNavItem(text, id) {
    const li = document.createElement('li');
    li.className = 'nav-item';
    li.role = 'presentation';

    const a = document.createElement('a');
    a.className = 'nav-link';
    a.id = `${id}-tab`;
    a.dataset.toggle = 'tab';
    a.href = `#${id}`;
    a.role = 'tab';
    a.ariaControls = id;
    a.ariaSelected = 'false';
    a.textContent = text;

    li.appendChild(a);
    return li;
  }

  static createTabContent() {
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = 'myTabContent';

    const loginTabPane = UIModal.createTabPane('home', true);
    const loginForm = UIModal.createForm(formId.LOGIN, [
      {
        name: 'name', type: 'text', placeholder: 'Name', autocomplete: 'username',
      },
      {
        name: 'password', type: 'password', placeholder: 'Password', autocomplete: 'current-password',
      },
    ], 'Login', 'login-btn');

    loginTabPane.appendChild(loginForm);
    tabContent.appendChild(loginTabPane);

    const signinTabPane = UIModal.createTabPane('profile');
    const signinForm = UIModal.createForm(formId.SIGNIN, [
      {
        name: 'name', type: 'text', placeholder: 'Name', autocomplete: 'username',
      },
      {
        name: 'password', type: 'password', placeholder: 'Password', autocomplete: 'new-password',
      },
      {
        name: 'passwordAgain', type: 'password', placeholder: 'Password again', autocomplete: 'new-password',
      },
    ], 'Submit', 'signin-btn');

    signinTabPane.appendChild(signinForm);
    tabContent.appendChild(signinTabPane);

    return tabContent;
  }

  static createTabPane(id, isActive = false) {
    const tabPane = document.createElement('div');
    tabPane.className = `tab-pane fade${isActive ? ' show active' : ''}`;
    tabPane.id = id;
    tabPane.role = 'tabpanel';
    tabPane.setAttribute('aria-labelledby', `${id}-tab`);
    return tabPane;
  }

  static createForm(id, inputs, buttonText, buttonId) {
    const form = document.createElement('form');
    form.id = id;

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';

    inputs.forEach((input) => {
      const colDiv = document.createElement('div');
      colDiv.className = 'col';

      const inputElement = document.createElement('input');
      inputElement.type = input.type;
      inputElement.name = input.name;
      inputElement.className = 'form-control';
      inputElement.placeholder = input.placeholder;
      inputElement.autocomplete = input.autocomplete;

      colDiv.appendChild(inputElement);
      rowDiv.appendChild(colDiv);
    });

    form.appendChild(rowDiv);

    const button = document.createElement('button');
    button.id = buttonId;
    button.className = 'btn btn-primary';
    button.type = 'submit';
    button.textContent = buttonText;

    form.appendChild(button);

    return form;
  }
}

export default UIModal;
