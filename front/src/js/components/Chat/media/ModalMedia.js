export default class ModalMedia {
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
      <div id="modal" class="modal-chat ">
        <div class="modal-content">
          <h4>Что-то пошло не так</h2>
          <p>Пожалуйста, дайте разрешение на использование аудио- или видеозаписи, либо используйте другой браузер</p>
          <p>
            Чтобы изменить настройки разрешений для данного сайта, следуйте этим шагам:

            Откройте страницу сайта, для которого вы хотите изменить разрешения.
            Найдите значок "замка" слева от адресной строки браузера.
            Нажмите на значок "замка" и выберите "Настройки сайта" или "Разрешения" (зависит от браузера).
            Найдите настройку микрофона/камеры и измените ее на "Разрешить".
            Закройте настройки и обновите страницу. Теперь сайт должен иметь доступ к микрофону/камере.
          </p>
          <div class="btn-modal-wrapper">
            <button class="close-geo">Закрыть</button>
          </div>
        </div>
      </div>
    `;
  }

  events() {
    const closeButton = document.querySelector('.close-geo');
    closeButton.addEventListener('click', () => this.closeModal());
  }

  closeModal() {
    this.container.innerHTML = '';
  }
}
