const logger = require('../utils/logger');

let marketSubscriptions = new Map();

const initializeWebSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Subscribe to market data
    socket.on('subscribe-market', (symbol) => {
      if (!marketSubscriptions.has(symbol)) {
        marketSubscriptions.set(symbol, new Set());
        startMarketStream(io, symbol);
      }
      marketSubscriptions.get(symbol).add(socket.id);
      logger.info(`${socket.id} subscribed to ${symbol}`);
    });

    // Unsubscribe from market data
    socket.on('unsubscribe-market', (symbol) => {
      const subscribers = marketSubscriptions.get(symbol);
      if (subscribers) {
        subscribers.delete(socket.id);
        if (subscribers.size === 0) {
          marketSubscriptions.delete(symbol);
        }
      }
      logger.info(`${socket.id} unsubscribed from ${symbol}`);
    });

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
      // Clean up subscriptions
      marketSubscriptions.forEach((subscribers) => {
        subscribers.delete(socket.id);
      });
    });
  });
};

const startMarketStream = (io, symbol) => {
  // Simulate market data updates every 2 seconds
  const interval = setInterval(() => {
    if (!marketSubscriptions.has(symbol)) {
      clearInterval(interval);
      return;
    }

    const basePrice = 1.0850;
    const marketData = {
      symbol,
      bid: basePrice + (Math.random() - 0.5) * 0.01,
      ask: basePrice + (Math.random() - 0.5) * 0.01,
      timestamp: new Date().toISOString()
    };

    io.emit(`market-update-${symbol}`, marketData);
  }, 2000);
};

module.exports = { initializeWebSocket };