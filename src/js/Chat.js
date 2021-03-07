import UsernameForm from './UsernameForm';
import API from './API';
import createErrorPopup from './createErrorPopup';

export default class Chat {
  constructor(url) {
    this.url = url;
    this.API = new API(this);
    this.usernameForm = new UsernameForm(this);
    [this.users] = document.getElementsByClassName('chat_users');
    [this.chatMessages] = document.getElementsByClassName('chat_messages');
    this.textarea = document.getElementById('message-textarea');
  }

  openChat() {
    this.usernameForm.close();
    const chat = document.getElementById('chat');
    chat.classList.remove('hidden');
  }

  createUser(data) {
    this.API.sendMessage('newUser', data);
  }

  addUser(username) {
    const isYou = this.username === username;
    const userElem = `
      <div class="chat_user" data-username="${username}">
        <div class="chat_user_avatar"></div>
        <div class="chat_user_name${isYou ? ' chat_user_you' : ''}">
          ${username}${isYou ? ' (you)' : ''}
        </div>
      </div>`;
    this.users.insertAdjacentHTML('beforeend', userElem);
  }

  removeUser(username) {
    const userElem = document.querySelector(`[data-username="${username}"]`);
    userElem?.remove();
  }

  showError(message) {
    createErrorPopup(message);
  }

  addNewMessage(data) {
    const { chatMessages } = this;
    const isScrollAtBottom = this.isScrollAtBottom(chatMessages);

    const messageElem = this.getMessageHTML(data);
    chatMessages.insertAdjacentHTML('beforeend', messageElem);

    if (isScrollAtBottom) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  getMessageHTML(data) {
    const date = new Date(data.date);
    const formattedDate = this.getFormattedDate(date);
    const isYou = this.username === data.username;
    const username = isYou ? 'You' : data.username;
    return `
      <div class="chat_message${isYou ? ' chat_message_yours' : ''}">
        <div class="chat_message_username">${username}, ${formattedDate}</div>
        <div class="chat_message_content">${data.message}</div>
      </div>`;
  }

  isScrollAtBottom(container) {
    // не всегда получаются целые числа, поэтому просто понаставил Math.ceil()
    return (
      Math.ceil(container.scrollHeight)
      === Math.ceil(container.scrollTop + container.clientHeight)
    );
  }

  getFormattedDate(date) {
    const twoDigits = (number) => (number < 10 ? `0${number}` : number);

    const day = twoDigits(date.getDate());
    const month = twoDigits(date.getMonth() + 1);
    const year = date.getFullYear();
    const DMY = `${day}.${month}.${year}`;

    const hours = twoDigits(date.getHours());
    const minutes = twoDigits(date.getMinutes());
    const seconds = twoDigits(date.getSeconds());
    const time = `${hours}:${minutes}:${seconds}`;

    return `${time} ${DMY}`;
  }

  registerEvents() {
    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Enter'
        && !e.shiftKey
        && document.activeElement === this.textarea
      ) {
        e.preventDefault();
        const { value } = e.target;
        e.target.value = '';
        this.API.sendMessage('message', value);
      }
    });
  }
}
