import { createElement, startTimer, stopTimer } from '../../../utils';
import FilePreview from '../FilePreview/FilePreview';
import ModalMedia from '../../Chat/ModalMedia/ModalMedia';
import { mediaTypes, messages } from '../../../constants';
import ModalNotification from '../ModalNotification/ModalNotification';

import './recorder.css';

export default class Recorder {
  constructor(container) {
    this.currentFileSize = 0;
    this.isRecordingStoppedDueToSize = false;
    this.container = container;
    this.recorder = null;
    this.chunks = [];
    this.mediaFile = null;
    this.preview = null;
    this.mediaActionWrapper = null;
    this.audioButton = null;
    this.videoButton = null;
    this.startButton = null;
    this.stopButton = null;
    this.timerElement = null;

    this.init();
  }

  init() {
    this.createRecorder();
    this.events();
  }

  createRecorder() {
    this.startButton = createElement('button', {
      classes: ['btn-media', 'start-media'],
      attributes: {
        type: 'button',
      },
    });
    this.stopButton = createElement('button', {
      classes: ['btn-media', 'stop-media'],
      attributes: {
        type: 'button',
      },
    });

    this.timerElement = createElement('div', {
      classes: ['timer'],
      textContent: '00:00',
      attributes: {
        id: 'timer',
      },
    });

    this.mediaActionWrapper = createElement('div', {
      classes: ['media-action-wrapper', 'hidden'],
      children: [this.startButton, this.timerElement, this.stopButton],
    });

    this.audioButton = createElement('button', {
      classes: ['btn-media', 'audio-button'],
      attributes: {
        type: 'button',
      },
    });
    this.videoButton = createElement('button', {
      classes: ['btn-media', 'video-button'],
      attributes: {
        type: 'button',
      },
    });

    this.mediaButtonWrapper = createElement('div', {
      classes: ['media-button-wrapper'],
      children: [this.audioButton, this.videoButton],
    });

    this.container.append(this.mediaButtonWrapper);
    this.container.append(this.mediaActionWrapper);
  }

  events() {
    this.startButton.addEventListener('click', () => this.startRecording());
    this.stopButton.addEventListener('click', () => this.stopRecording());
    this.audioButton.addEventListener('click', () => this.writeMedia({ audio: true, video: false }));
    this.videoButton.addEventListener('click', () => this.writeMedia({ audio: true, video: true }));
  }

  writeMedia(constraints) {
    this.toggleMediaButtonVisibility();
    this.setupMediaRecorder(constraints);
  }

  startRecording() {
    if (!this.recorder) {
      return;
    }

    this.startButton.disabled = true;

    this.recorder.start();
    startTimer('#timer');
  }

  stopRecording() {
    this.toggleMediaButtonVisibility();
    this.startButton.disabled = false;

    if (this.recorder && this.recorder.state !== 'inactive') {
      this.recorder.stop();
    }
  }

  toggleMediaButtonVisibility() {
    this.mediaButtonWrapper.classList.toggle('hidden');
    this.mediaActionWrapper.classList.toggle('hidden');
  }

  async setupMediaRecorder(constraints) {
    this.isRecordingStoppedDueToSize = false;
    this.startButton.disabled = true;
    this.chunks = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.recorder = new MediaRecorder(stream);

      this.recorder.addEventListener('start', () => { this.currentFileSize = 0; });
      this.recorder.addEventListener('dataavailable', (event) => {
        if (this.currentFileSize + event.data.size > mediaTypes.MAX_FILE_SIZE) {
          this.recorder.stop();
          this.modal = new ModalNotification(messages.NOTIFICATION_MAX_MEDIA_SIZE_LIMIT);
          this.isRecordingStoppedDueToSize = true;
        } else {
          this.chunks.push(event.data);
          this.currentFileSize += event.data.size;
        }
      });

      this.recorder.addEventListener('stop', () => this.handleRecordingStop(constraints));

      this.startButton.disabled = false;
    } catch {
      this.handleError();
    }
  }

  handleRecordingStop(constraints) {
    stopTimer('#timer');

    if (!this.isRecordingStoppedDueToSize) {
      this.mediaType = constraints;
      this.mediaFile = Recorder.createMediaFile(this.chunks, constraints);
      this.preview = new FilePreview(this.mediaFile, () => this.reset());
    }

    this.isRecordingStoppedDueToSize = false;
    this.chunks = [];
    this.currentFileSize = 0;
  }

  handleError() {
    this.startButton.disabled = false;
    this.modalMedia = new ModalMedia(this.modalWindow);
  }

  static createMediaUrl(chunks, constraints) {
    const mediaType = constraints.video
      ? 'video/webm'
      : 'audio/ogg; codecs=opus';
    const blob = new Blob(chunks, { type: mediaType });
    return URL.createObjectURL(blob);
  }

  static createMediaFile(chunks, constraints) {
    const mediaType = constraints.video
      ? 'video/webm'
      : 'audio/ogg; codecs=opus';
    return new File(chunks, `media.${constraints.video ? 'webm' : 'ogg'}`, {
      type: mediaType,
    });
  }

  getMediaFile() {
    return this.mediaFile;
  }

  reset() {
    this.mediaFile = null;
  }
}
