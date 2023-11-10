import { createElement } from '../../../utils';

import './user-info.css';

export default class UserInfo {
  constructor(container, user) {
    this.container = container;
    this.user = user;
    this.userInfoContainer = null;
    this.userAvatar = null;
    this.userName = null;
    this.init();
  }

  init() {
    this.createUserInfo();
  }

  createUserInfo() {
    this.userAvatar = createElement('div', {
      classes: ['user-avatar'],
      children: [createElement('img', {
        attributes: {
          src: this.user.avatarURL,
          alt: 'User Avatar',
        },
      })],
    });

    this.userName = createElement('div', {
      classes: ['user-name'],
      textContent: this.user.name,
    });

    this.userInfoContainer = createElement('div', {
      classes: ['user-info'],
      children: [this.userAvatar, this.userName],
    });

    this.container.append(this.userInfoContainer);
  }
}
