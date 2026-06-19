const logger = require('../utils/logger');
const { io } = require('../index');

// Mock market data
const MARKETS = [
  { symbol: 'EURUSD', name: 'EUR/USD', category: 'forex', bid: 1.0850, ask: 1.0852 },
  { symbol: 'GBPUSD', name: 'GBP/USD', category: 'forex', bid: 1.2650, ask: 1.2652 },
  { symbol: 'USDJPY', name: 'USD/JPY', category: 'forex', bid: 110.50, ask: 110.52 },
  { symbol: 'GOLD', name: 'Gold', category: 'commodities', bid: 1950, ask: 1952 },
  { symbol: 'SP500', name: 'S&P 500', category: 'indices', bid: 4200, ask: 4202 }
];

const userAccounts = new Map();

exports.getMarkets = (req, res) => {
  try {
    res.json(MARKETS);
  } catch (error) {
    logger.error('Get markets error:', error);
    res.status(500).json({ error: 'Failed to fetch markets' });
  }
};

exports.getQuotes = (req, res) => {
  try {
    const { symbol } = req.params;
    const market = MARKETS.find(m => m.symbol === symbol);

    if (!market) {
      return res.status(404).json({ error: 'Market not found' });
    }

    res.json({
      symbol: market.symbol,
      bid: market.bid + (Math.random() - 0.5) * 0.01,
      ask: market.ask + (Math.random() - 0.5) * 0.01,
      last: (market.bid + market.ask) / 2,
      high: market.ask * 1.02,
      low: market.bid * 0.98,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Get quotes error:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
};

exports.getBalance = (req, res) => {
  try {
    const account = userAccounts.get(req.user.id) || {
      balance: 5000,
      equity: 5150,
      availableMargin: 5000,
      usedMargin: 0,
      currency: 'USD'
    };

    res.json(account);
  } catch (error) {
    logger.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
};

exports.connectAccount = (req, res) => {
  try {
    const { apiKey, apiSecret } = req.body;

    if (!apiKey) {
      return res.status(400).json({ error: 'API key required' });
    }

    // Store account connection
    userAccounts.set(req.user.id, {
      connected: true,
      balance: 5000,
      equity: 5150,
      availableMargin: 5000,
      usedMargin: 0,
      currency: 'USD',
      connectedAt: new Date()
    });

    logger.info(`Deriv account connected for user: ${req.user.id}`);

    res.json({ 
      message: 'Account connected successfully',
      account: userAccounts.get(req.user.id)
    });
  } catch (error) {
    logger.error('Connect account error:', error);
    res.status(500).json({ error: 'Failed to connect account' });
  }
};