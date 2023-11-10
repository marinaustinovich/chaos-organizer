import { mediaTypes, messages } from '../../../constants';
import { createElement } from '../../../utils';
import FilePreview from '../FilePreview/FilePreview';

import './file-uploader.css';

export default class FileUploader {
  constructor(container, dragContainer) {
    this.container = container;
    this.dragContainer = dragContainer;
    this.fileInput = null;
    this.uploadWrapper = null;
    this.uploadedFile = null;
    this.preview = null;

    this.init();
  }

  init() {
    this.createFileUploader();
    this.events();
  }

  createFileUploader() {
    const uploadButton = createElement('button', {
      classes: ['btn-media', 'upload-button'],
      attributes: {
        type: 'button',
      },
    });

    this.fileInput = createElement('input', {
      classes: ['overlapped'],
      attributes: {
        type: 'file',
        'data-id': 'file',
      },
    });

    this.uploadWrapper = createElement('div', {
      classes: ['upload-wrapper'],
      children: [uploadButton, this.fileInput],
    });

    this.container.insertBefore(this.uploadWrapper, this.container.firstChild);
  }

  events() {
    this.fileInput.addEventListener('change', () => this.onChange());
    this.uploadWrapper.addEventListener('click', (e) => {
      if (e.target !== this.fileInput) {
        this.fileInput.dispatchEvent(new MouseEvent('click'));
      }
    });
    this.dragContainer.addEventListener('dragover', (e) => e.preventDefault());
    this.dragContainer.addEventListener('drop', (e) => this.onDrop(e));
  }

  onChange() {
    const file = this.fileInput.files && this.fileInput.files[0];
    if (!file) return;

    if (file.size > mediaTypes.MAX_FILE_SIZE) {
      alert(messages.ERROR_MAX_FILE_SIZE_LIMIT);
      return;
    }

    this.uploadedFile = file;
    this.preview = new FilePreview(this.uploadedFile, () => this.reset());
    this.fileInput.value = null;
  }

  onDrop(e) {
    e.preventDefault();

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;

    if (file.size > mediaTypes.MAX_FILE_SIZE) {
      alert(messages.ERROR_MAX_FILE_SIZE_LIMIT);
      return;
    }

    this.uploadedFile = file;
    this.preview = new FilePreview(this.uploadedFile, () => this.reset());
  }

  getUploadedFile() {
    return this.uploadedFile;
  }

  reset() {
    this.uploadedFile = null;
  }
}
