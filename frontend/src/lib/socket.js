import { io } from 'socket.io-client';
import { SOCKET_URL } from './api';

let socketInstance;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  if (!socketInstance.connected) {
    socketInstance.connect();
  }
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = undefined;
  }
};
