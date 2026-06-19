const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const derivService = require('../services/derivService');
const logger = require('../utils/logger');

// Get all markets
router.get('/markets', authMiddleware, (req, res) => {
  try {
    const symbols = derivService.getAllSymbols();
    const markets = Object.entries(symbols).map(([symbol, data]) => ({
      symbol,
      ...data,
      bid: 1.0850 + (Math.random() - 0.5) * 0.01,
      ask: 1.0852 + (Math.random() - 0.5) * 0.01
    }));

    res.json(markets);
  } catch (error) {
    logger.error('Get markets error:', error);
    res.status(500).json({ error: 'Failed to fetch markets' });
  }
});

// Get quotes for specific symbol
router.get('/quotes/:symbol', authMiddleware, (req, res) => {
  try {
    const { symbol } = req.params;
    const market = derivService.getAllSymbols()[symbol];

    if (!market) {
      return res.status(404).json({ error: 'Market not found' });
    }

    const basePrice = 1.0850;
    const bid = basePrice + (Math.random() - 0.5) * 0.01;
    const ask = bid + 0.0002;

    res.json({
      symbol,
      name: market.name,
      category: market.category,
      type: market.type,
      bid: parseFloat(bid.toFixed(5)),
      ask: parseFloat(ask.toFixed(5)),
      mid: parseFloat(((bid + ask) / 2).toFixed(5)),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Get quotes error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Get account balance
router.get('/account/balance', authMiddleware, (req, res) => {
  try {
    const account = {
      balance: 5000,
      equity: 5150,
      availableMargin: 5000,
      usedMargin: 0,
      currency: 'USD',
      leverage: 1
    };

    res.json(account);
  } catch (error) {
    logger.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

// Connect Deriv account
router.post('/account/connect', authMiddleware, async (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    // In production, connect to real Deriv API
    logger.info(`Deriv account connection initiated for user: ${req.user.id}`);

    res.json({
      message: 'Account connected successfully',
      account: {
        connected: true,
        balance: 5000,
        equity: 5150,
        availableMargin: 5000,
        usedMargin: 0,
        currency: 'USD',
        connectedAt: new Date()
      }
    });
  } catch (error) {
    logger.error('Connect account error:', error);
    res.status(500).json({ error: 'Failed to connect account' });
  }
});

module.exports = router;