import io from 'socket.io-client';

let socket = null;

export const initializeWebSocket = () => {
  const token = localStorage.getItem('token');
  
  socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  socket.on('connect', () => {
    console.log('WebSocket connected');
  });

  socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

  return socket;
};

export const subscribeToMarket = (symbol) => {
  if (socket) {
    socket.emit('subscribe-market', symbol);
  }
};

export const unsubscribeFromMarket = (symbol) => {
  if (socket) {
    socket.emit('unsubscribe-market', symbol);
  }
};

export const onMarketUpdate = (symbol, callback) => {
  if (socket) {
    socket.on(`market-update-${symbol}`, callback);
  }
};

export const getSocket = () => socket;