const logger = require('../utils/logger');
const { io } = require('../index');

const trades = new Map();
const portfolios = new Map();

exports.createTrade = (req, res) => {
  try {
    const { symbol, direction, amount, duration, durationUnit } = req.body;

    // Validation
    if (!symbol || !direction || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['call', 'put'].includes(direction)) {
      return res.status(400).json({ error: 'Invalid direction' });
    }

    // Create trade
    const tradeId = `trade_${Date.now()}`;
    const trade = {
      tradeId,
      userId: req.user.id,
      symbol,
      direction,
      amount,
      entryPrice: 1.0851 + (Math.random() - 0.5) * 0.01,
      status: 'open',
      createdAt: new Date(),
      duration,
      durationUnit: durationUnit || 'seconds',
      profit: 0
    };

    trades.set(tradeId, trade);

    // Broadcast trade event
    io.emit('trade-opened', trade);

    logger.info(`Trade created: ${tradeId}`);

    res.status(201).json(trade);
  } catch (error) {
    logger.error('Create trade error:', error);
    res.status(500).json({ error: 'Failed to create trade' });
  }
};

exports.getTrades = (req, res) => {
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
      limit,
      offset
    });
  } catch (error) {
    logger.error('Get trades error:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

exports.getTrade = (req, res) => {
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
};

exports.closeTrade = (req, res) => {
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
};

exports.getPortfolio = (req, res) => {
  try {
    const userId = req.user.id;
    const userTrades = Array.from(trades.values()).filter(t => t.userId === userId);

    const openTrades = userTrades.filter(t => t.status === 'open').length;
    const closedTrades = userTrades.filter(t => t.status === 'closed').length;
    const totalProfit = userTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const wins = userTrades.filter(t => t.profit > 0).length;
    const winRate = closedTrades > 0 ? (wins / closedTrades) * 100 : 0;

    const portfolio = portfolios.get(userId) || {
      balance: 5000,
      equity: 5000 + totalProfit,
      openTrades,
      closedTrades,
      totalProfit,
      winRate: winRate.toFixed(2),
      trades: userTrades
    };

    res.json(portfolio);
  } catch (error) {
    logger.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};