const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { io } = require('../index');
const logger = require('../utils/logger');

const trades = new Map();
const portfolios = new Map();

// Create trade
router.post('/trades', authMiddleware, (req, res) => {
  try {
    const { symbol, direction, amount, duration, durationUnit, aiGenerated } = req.body;

    // Validation
    if (!symbol || !direction || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['call', 'put'].includes(direction)) {
      return res.status(400).json({ error: 'Invalid direction' });
    }

    // Create trade
    const tradeId = `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const trade = {
      tradeId,
      userId: req.user.id,
      symbol,
      direction,
      amount: parseFloat(amount),
      entryPrice: 1.0851 + (Math.random() - 0.5) * 0.01,
      status: 'open',
      createdAt: new Date(),
      duration: parseInt(duration),
      durationUnit: durationUnit || 'seconds',
      profit: 0,
      aiGenerated: aiGenerated || false
    };

    trades.set(tradeId, trade);

    // Broadcast trade event
    io.emit('trade-opened', trade);

    logger.info(`Trade created: ${tradeId} (${aiGenerated ? 'AI' : 'Manual'})`);

    res.status(201).json(trade);
  } catch (error) {
    logger.error('Create trade error:', error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
});

// Get user trades
router.get('/trades', authMiddleware, (req, res) => {
  try {
    const { status = 'all', limit = 50, offset = 0 } = req.query;
    const userId = req.user.id;

    let userTrades = Array.from(trades.values())
      .filter(t => t.userId === userId);

    if (status !== 'all') {
      userTrades = userTrades.filter(t => t.status === status);
    }

    const paginatedTrades = userTrades
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(offset, offset + limit);

    res.json({
      trades: paginatedTrades,
      total: userTrades.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    logger.error('Get trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

// Get single trade
router.get('/trades/:tradeId', authMiddleware, (req, res) => {
  try {
    const { tradeId } = req.params;
    const trade = trades.get(tradeId);

    if (!trade || trade.userId !== req.user.id) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    res.json(trade);
  } catch (error) {
    logger.error('Get trade error:', error);
    res.status(500).json({ error: 'Failed to fetch trade' });
  }
});

// Close trade
router.post('/trades/:tradeId/close', authMiddleware, (req, res) => {
  try {
    const { tradeId } = req.params;
    const trade = trades.get(tradeId);

    if (!trade || trade.userId !== req.user.id) {
      return res.status(404).json({ error: 'Trade not found' });
    }

    if (trade.status !== 'open') {
      return res.status(400).json({ error: 'Trade is not open' });
    }

    // Calculate profit/loss
    const exitPrice = 1.0860 + (Math.random() - 0.5) * 0.01;
    const profit = (exitPrice - trade.entryPrice) * trade.amount * 100;

    trade.status = 'closed';
    trade.exitPrice = exitPrice;
    trade.profit = profit;
    trade.closedAt = new Date();

    trades.set(tradeId, trade);

    // Broadcast trade event
    io.emit('trade-closed', trade);

    logger.info(`Trade closed: ${tradeId}, Profit: ${profit}`);

    res.json(trade);
  } catch (error) {
    logger.error('Close trade error:', error);
    res.status(500).json({ error: 'Failed to close trade' });
  }
});

// Get portfolio
router.get('/portfolio', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id;
    const userTrades = Array.from(trades.values()).filter(t => t.userId === userId);

    const openTrades = userTrades.filter(t => t.status === 'open').length;
    const closedTrades = userTrades.filter(t => t.status === 'closed').length;
    const totalProfit = userTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const wins = userTrades.filter(t => t.profit > 0).length;
    const winRate = closedTrades > 0 ? (wins / closedTrades) * 100 : 0;

    const portfolio = {
      balance: 5000,
      equity: 5000 + totalProfit,
      openTrades,
      closedTrades,
      totalProfit: parseFloat(totalProfit.toFixed(2)),
      winRate: parseFloat(winRate.toFixed(2)),
      aiTrades: userTrades.filter(t => t.aiGenerated).length,
      manualTrades: userTrades.filter(t => !t.aiGenerated).length,
      trades: userTrades.sort((a, b) => b.createdAt - a.createdAt).slice(0, 50)
    };

    res.json(portfolio);
  } catch (error) {
    logger.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

module.exports = router;