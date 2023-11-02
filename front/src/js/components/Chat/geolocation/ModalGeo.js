import isValidGeo from './isValidGeo';

export default class ModalGeo {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.drawUi();
    this.events();
  }

  drawUi() {
    this.container.innerHTML = `
      <div id="modal" class="modal-chat">
        <div class="modal-content">
          <h4>Что-то пошло не так</h2>
          <p>К сожалению, нам не удалось определить Ваше местоположение, пожалуйста, дайте разрешение на использование геолокации, либо введите координаты вручную</p>
          <label for="geo">Широта и долгота через запятую</label>
          <input name="geo" type="text" id="geo-input" class="geo-input" placeholder="51.50851, −0.12572" />
          <div class="btn-modal-wrapper">
            <button class="close-geo">Отмена</button>
            <button class="add-geo">Ok</button>
          </div>
        </div>
        <div class="error-container"></div>
      </div>
    `;
  }

  events() {
    this.modal = document.getElementById('modal');
    const addButton = this.modal.querySelector('.add-geo');
    const closeButton = this.modal.querySelector('.close-geo');
    this.input = this.modal.querySelector('#geo-input');
    this.error = this.container.querySelector('.error-container');

    addButton.addEventListener('click', () => this.addGeo());
    closeButton.addEventListener('click', () => this.closeModal());
    this.input.addEventListener('click', () => {
      this.input.value = '';
      this.hideError();
    });
  }

  addGeo() {
    const geo = this.input.value;

    if (geo) {
      const result = isValidGeo(geo);

      if (typeof result === 'string') {
        this.showError(result);
      } else {
        this.coords = result;
        this.modal.style.display = 'none';
      }
    } else {
      this.showError('Пожалуйста, введите ваши координаты');
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

  getCoords() {
    return this.coords;
  }
}
