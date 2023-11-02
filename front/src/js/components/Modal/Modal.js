import WebSocketClient from '../../api/WebSocket';
import isValidPassword from '../../utils/validation';
import UIModal from './UIModal';

import './modal.css';

export default class Modal {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.errorContainer = null;
    this.webSocketClient = new WebSocketClient();
    this.DOM = new UIModal(this.container);
    this.hideError = this.hideError.bind(this);
  }

  init() {
    this.drawUi();
    this.events();
  }

  drawUi() {
    this.DOM.createModal();

    this.modal = this.container.querySelector('#modal');
    this.loginForm = this.container.querySelector('#login');
    this.signinForm = this.container.querySelector('#signin');
    this.errorContainer = this.container.querySelector('.error-container');

    this.passwordInputSignin = this.signinForm.querySelector('[name="password"]');
    this.passwordAgainInput = this.signinForm.querySelector(
      '[name="passwordAgain"]',
    );
  }

  events() {
    window.addEventListener('load', () => {
      this.modal.style.display = 'block';
      this.errorContainer.style.display = 'none';
    });

    this.container.addEventListener('submit', this.handleSubmit);
    this.passwordInputSignin.addEventListener('input', this.validatePassword);
    this.passwordAgainInput.addEventListener('input', this.validatePassword);
    this.passwordAgainInput.addEventListener(
      'input',
      this.handlePasswordAgainInput,
    );

    this.addFocusListeners(this.loginForm);
    this.addFocusListeners(this.signinForm);
  }

  addFocusListeners(form) {
    const inputs = form.querySelectorAll('input');
    inputs.forEach((input) => {
      input.addEventListener('focus', this.hideError);
    });
  }

  handlePasswordAgainInput = () => {
    if (this.passwordInputSignin.value !== this.passwordAgainInput.value) {
      this.showError('Passwords do not match.');
    } else {
      this.hideError();
    }
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (form.tagName !== 'FORM') return;

    const { name, password, passwordAgain } = form.elements;

    if (!name.value || !password.value) {
      this.showError('Please enter your name and password');
      return;
    }

    if (form.id === 'signin' && !this.validatePassword()) return;

    if (form.id === 'signin' && password.value !== passwordAgain.value) {
      this.showError('Passwords do not match.');
      return;
    }

    try {
      await this.webSocketClient.connect(form.id, {
        name: name.value,
        password: password.value,
      });
      this.modal.style.display = 'none';
      this.hideError();
      form.reset();
    } catch (error) {
      console.error(error);
      this.showError('An error occurred, please try again.');
    }
  };

  validatePassword = () => {
    if (!isValidPassword(this.passwordInputSignin.value)) {
      this.showError(
        'Password should be at least 8 characters long and contain only Latin letters and digits.',
      );

      return false;
    }
    this.hideError();
    return true;
  };

  showError(message) {
    this.errorContainer.textContent = message;
    this.errorContainer.style.display = 'block';
  }

  hideError() {
    this.errorContainer.style.display = 'none';
  }
}
