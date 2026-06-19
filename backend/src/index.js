const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const { createServer } = require('http');
const { Server } = require('socket.io');
const logger = require('./utils/logger');
const { initializeAIEngine } = require('./config/aiInit');
const derivService = require('./services/derivService');

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/deriv', require('./routes/deriv'));
app.use('/api/trading', require('./routes/trading'));
app.use('/api/analysis', require('./routes/analysis'));
app.use('/api/ai', require('./routes/ai'));

// WebSocket events
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('subscribe-market', (symbol) => {
    logger.info(`Client subscribed to ${symbol}`);
    // Subscribe to real Deriv market data
    derivService.subscribeToPrices(symbol, (data) => {
      socket.emit(`market-update-${symbol}`, data);
    });
  });

  socket.on('unsubscribe-market', (symbol) => {
    logger.info(`Client unsubscribed from ${symbol}`);
  });

  socket.on('get-analysis', async (symbol) => {
    logger.info(`Requested analysis for ${symbol}`);
    // Send real-time analysis
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Start server and initialize AI engine
httpServer.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Initialize AI trading engine
  await initializeAIEngine();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  derivService.disconnect();
  httpServer.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

module.exports = { app, io };