const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const derivService = require('../services/derivService');
const aiTradingEngine = require('../services/aiTradingEngine');
const digitsMarketAnalyzer = require('../services/digitsMarketAnalyzer');
const logger = require('../utils/logger');

// Get all available symbols
router.get('/symbols', authMiddleware, (req, res) => {
  try {
    const symbols = derivService.getAllSymbols();
    res.json({
      total: Object.keys(symbols).length,
      symbols: symbols
    });
  } catch (error) {
    logger.error('Error fetching symbols:', error);
    res.status(500).json({ error: 'Failed to fetch symbols' });
  }
});

// Get symbols by category
router.get('/symbols/category/:category', authMiddleware, (req, res) => {
  try {
    const { category } = req.params;
    const symbols = derivService.getSymbolsByCategory(category);
    res.json({
      category,
      total: symbols.length,
      symbols: symbols
    });
  } catch (error) {
    logger.error('Error fetching symbols by category:', error);
    res.status(500).json({ error: 'Failed to fetch symbols' });
  }
});

// Get Digits market symbols
router.get('/digits/symbols', authMiddleware, (req, res) => {
  try {
    const symbols = derivService.getDigitsSymbols();
    res.json({
      type: 'digits',
      total: symbols.length,
      symbols: symbols
    });
  } catch (error) {
    logger.error('Error fetching digits symbols:', error);
    res.status(500).json({ error: 'Failed to fetch digits symbols' });
  }
});

// Analyze specific market
router.get('/analyze/:symbol', authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.params;
    const analysis = await aiTradingEngine.analyzeMarket(symbol);
    res.json(analysis);
  } catch (error) {
    logger.error('Error analyzing market:', error);
    res.status(500).json({ error: 'Failed to analyze market' });
  }
});

// Analyze all digits markets
router.get('/digits/analyze/all', authMiddleware, async (req, res) => {
  try {
    const analysis = await digitsMarketAnalyzer.analyzeAllDigitsMarkets();
    res.json(analysis);
  } catch (error) {
    logger.error('Error analyzing digits markets:', error);
    res.status(500).json({ error: 'Failed to analyze digits markets' });
  }
});

// Analyze single digits market
router.get('/digits/analyze/:symbol', authMiddleware, async (req, res) => {
  try {
    const { symbol } = req.params;
    const analysis = await digitsMarketAnalyzer.analyzeDigitsMarket(symbol);
    res.json(analysis);
  } catch (error) {
    logger.error('Error analyzing digits market:', error);
    res.status(500).json({ error: 'Failed to analyze digits market' });
  }
});

// Get signals for manual traders
router.get('/digits/signals', authMiddleware, (req, res) => {
  try {
    const signals = digitsMarketAnalyzer.getSignalsForManualTraders();
    res.json(signals);
  } catch (error) {
    logger.error('Error fetching signals:', error);
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
});

// Get best performing digits markets
router.get('/digits/best', authMiddleware, (req, res) => {
  try {
    const limit = req.query.limit || 5;
    const best = digitsMarketAnalyzer.getBestPerformingMarkets(parseInt(limit));
    res.json({
      limit: parseInt(limit),
      markets: best
    });
  } catch (error) {
    logger.error('Error fetching best markets:', error);
    res.status(500).json({ error: 'Failed to fetch best markets' });
  }
});

// Execute automatic trade
router.post('/trade/execute', authMiddleware, async (req, res) => {
  try {
    const { symbol, strategy } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol required' });
    }

    const result = await aiTradingEngine.executeTrade(symbol, strategy);
    res.json(result);
  } catch (error) {
    logger.error('Error executing trade:', error);
    res.status(500).json({ error: 'Failed to execute trade' });
  }
});

// Execute digits trade
router.post('/digits/trade/execute', authMiddleware, async (req, res) => {
  try {
    const { symbol, manualOverride } = req.body;
    
    if (!symbol) {
      return res.status(400).json({ error: 'Symbol required' });
    }

    const result = await digitsMarketAnalyzer.executeDigitsTrade(symbol, manualOverride);
    res.json(result);
  } catch (error) {
    logger.error('Error executing digits trade:', error);
    res.status(500).json({ error: 'Failed to execute digits trade' });
  }
});

// Get AI strategy performance
router.get('/performance', authMiddleware, (req, res) => {
  try {
    const symbol = req.query.symbol;
    const performance = aiTradingEngine.getStrategyPerformance(symbol);
    res.json(performance);
  } catch (error) {
    logger.error('Error fetching performance:', error);
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
});

// Get all signals
router.get('/signals/all', authMiddleware, (req, res) => {
  try {
    const signals = aiTradingEngine.getAllSignals();
    res.json({
      total: signals.length,
      signals: signals
    });
  } catch (error) {
    logger.error('Error fetching signals:', error);
    res.status(500).json({ error: 'Failed to fetch signals' });
  }
});

// Get price history for a symbol
router.get('/history/:symbol', authMiddleware, (req, res) => {
  try {
    const { symbol } = req.params;
    const history = derivService.getPriceHistory(symbol);
    res.json({
      symbol,
      dataPoints: history.length,
      history: history
    });
  } catch (error) {
    logger.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

module.exports = router;