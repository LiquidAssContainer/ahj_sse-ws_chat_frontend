export default class API {
  constructor(chat) {
    this.chat = chat;
    this.url = chat.url;
    this.ws = new WebSocket(this.url);
    this.registerWsEvents(this.ws);
  }

  sendMessage(type, data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      const message = { type, data, userId: this.chat.userId };
      const json = JSON.stringify(message);
      this.ws.send(json);
    } else {
      // наверное, работает
      const interval = setInterval(() => {
        if (this.ws.readyState === WebSocket.OPEN) {
          clearInterval(interval);
          console.log('reconnected');
        }
        this.ws = new WebSocket(this.url);
      }, 500);
    }
  }

  registerWsEvents(ws) {
    ws.addEventListener('open', () => {
      console.log('connected');
    });

    ws.addEventListener('message', (e) => {
      try {
        const response = JSON.parse(e.data);
        const { data, type } = response;
        switch (type) {
          case 'userId':
            this.chat.openChat();
            this.chat.userId = data.id;
            this.chat.username = data.username;
            break;
          case 'message':
            this.chat.addNewMessage(data);
            break;
          case 'userCame':
            this.chat.addUser(data);
            break;
          case 'userGone':
            this.chat.removeUser(data);
            break;
          case 'usernameError':
            this.chat.showError(data);
            break;
          case 'error':
            console.log(data);
        }
      } catch (err) {
        console.log(err);
      }
    });

    ws.addEventListener('close', (e) => {
      console.log('connection closed', e);
    });

    ws.addEventListener('error', (e) => {
      console.log('some error', e);
    });
  }
}
