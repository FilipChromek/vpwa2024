import { Manager, Socket } from 'socket.io-client';

class WebSocketService {
  private manager: Manager;
  private socketMap: Record<string, Socket> = {};

  constructor() {
    this.manager = new Manager('http://localhost:3333', {
      autoConnect: false,
      transports: ['websocket'],
      withCredentials: true,
    });
  }

  getSocket(
    namespace: string,
    options?: { auth: { token: string | null } }
  ): Socket {
    if (!this.socketMap[namespace]) {
      this.socketMap[namespace] = this.manager.socket(namespace, options);
    } else if (options?.auth) {
      // If the socket already exists, update the auth configuration
      this.socketMap[namespace].auth = options.auth;
    }
    return this.socketMap[namespace];
  }

  connect(
    namespace: string,
    options?: { auth: { token: string | null } }
  ): Socket {
    const socket = this.getSocket(namespace, options);
    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  disconnect(namespace: string): void {
    const socket = this.socketMap[namespace];
    if (socket && socket.connected) {
      socket.disconnect();
    }
  }
}

const websocketService = new WebSocketService();
export default websocketService;
