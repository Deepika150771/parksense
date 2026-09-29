import { io } from 'socket.io-client';

// Connect to current origin or proxy target
const socket = io('/', {
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log('[Socket.io Client] Connected to ParkSense Realtime Gateway. ID:', socket.id);
});

socket.on('disconnect', () => {
  console.log('[Socket.io Client] Disconnected from server');
});

export default socket;
