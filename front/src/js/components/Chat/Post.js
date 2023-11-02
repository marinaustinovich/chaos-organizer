import dayjs from 'dayjs';

export default class Post {
  constructor(data) {
    this.data = data;
    if (this.data.video) this.mediaUrl = data.video;
    if (this.data.audio) this.mediaUrl = data.audio;

    this.userId = data.userId;
    this.post = null;
    this.createPost();
  }

  createPost() {
    this.post = document.createElement('div');
    this.post.classList.add('post');
    this.post.innerHTML = `
      <div class="post-date">${dayjs(this.data.date).format('HH:mm DD.MM.YY')}</div>
      <div class="post-content">
          <p class="text-post">${this.data.text}</p>
          ${this.mediaUrl ? this.renderMedia() : ''}
      </div>
      <div class="geodata">
          [${this.data.location.latitude}, ${this.data.location.longitude}] 
          <span class="geodata-icon"></span>
      </div>
    `;
    document.getElementById('posts').insertBefore(this.post, document.getElementById('posts').firstChild);
    document.querySelector('textarea').value = '';
    Post.scrollToTop();
  }

  renderMedia() {
    if (this.data.video) {
      return `<video src="${this.mediaUrl}" controls crossorigin="anonymous"></video>`;
    }

    if (this.data.audio) {
      return `<audio src="${this.mediaUrl}" controls crossorigin="anonymous"></audio>`;
    }

    return '';
  }

  static scrollToTop() {
    const containerPosts = document.getElementById('posts');
    containerPosts.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
