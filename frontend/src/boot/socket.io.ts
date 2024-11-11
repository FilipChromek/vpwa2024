import { boot } from 'quasar/wrappers';
import { io } from 'socket.io-client';

const socket = io('http://127.0.0.1:3333', {
  transports: ['websocket'],
  autoConnect: false,
});

export default boot(({ app }) => {
  app.config.globalProperties.$socket = socket;
});

export { socket };
