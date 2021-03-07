export default class UsernameForm {
  constructor(chat) {
    this.chat = chat;
    this.registerEvents();
  }

  close() {
    const modal = document.getElementById('username-modal');
    modal.classList.add('hidden');
  }

  registerEvents() {
    const form = document.getElementsByClassName('modal_form')[0];
    const input = document.getElementsByClassName('form_input')[0];
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.chat.createUser(input.value);
    });
  }
}
