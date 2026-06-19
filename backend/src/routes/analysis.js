const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const aiTradingEngine = require('../services/aiTradingEngine');
const logger = require('../utils/logger');

// Get AI prediction for symbol
router.get('/predict/:symbol', authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.params;
    const analysis = await aiTradingEngine.analyzeMarket(symbol);
    res.json(analysis);
  } catch (error) {
    logger.error('Get prediction error:', error);
    res.status(500).json({ error: 'Failed to get prediction' });
  }
});

// Get signals for symbol
router.get('/signals/:symbol', authMiddleware, (req, res) => {
  try {
    const { symbol } = req.params;
    const signal = aiTradingEngine.getSignal(symbol);
    
    if (!signal) {
      return res.status(404).json({ error: 'No signal data available' });
    }

    res.json({
      symbol,
      signal: signal.signal,
      strength: signal.strength,
      confidence: signal.confidence,
      reasons: signal.reasons,
      indicators: signal.indicators,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Get signals error:', error);
    res.status(500).json({ error: 'Failed to get signals' });
  }
});

// Get all signals
router.get('/signals', authMiddleware, (req, res) => {
  try {
    const signals = aiTradingEngine.getAllSignals();
    res.json({
      total: signals.length,
      signals: signals
    });
  } catch (error) {
    logger.error('Get all signals error:', error);
    res.status(500).json({ error: 'Failed to get signals' });
  }
});

// Get performance
router.get('/performance', authMiddleware, (req, res) => {
  try {
    const symbol = req.query.symbol;
    const performance = aiTradingEngine.getStrategyPerformance(symbol);
    res.json(performance);
  } catch (error) {
    logger.error('Get performance error:', error);
    res.status(500).json({ error: 'Failed to get performance' });
  }
});

module.exports = router;