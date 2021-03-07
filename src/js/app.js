import Chat from './Chat';

// const chat = new Chat('ws://localhost:7070');
const chat = new Chat('ws://ahj-sse-ws-chat.herokuapp.com');
chat.registerEvents();
