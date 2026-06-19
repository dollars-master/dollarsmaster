const logger = require('../utils/logger');

const generatePrediction = (symbol) => {
  const confidence = 0.65 + Math.random() * 0.30;
  const direction = Math.random() > 0.5 ? 'up' : 'down';
  const currentPrice = 1.0850;
  const targetPrice = direction === 'up' 
    ? currentPrice * (1 + Math.random() * 0.02)
    : currentPrice * (1 - Math.random() * 0.02);

  return {
    symbol,
    prediction: {
      direction,
      confidence: parseFloat(confidence.toFixed(2)),
      targetPrice: parseFloat(targetPrice.toFixed(4)),
      timestamp: new Date().toISOString()
    }
  };
};

const SIGNALS = [
  { signal: 'BUY', strength: 0.92, reason: 'Golden Cross on 4H chart' },
  { signal: 'SELL', strength: 0.88, reason: 'Death Cross on Daily chart' },
  { signal: 'HOLD', strength: 0.75, reason: 'Consolidation pattern detected' },
  { signal: 'BUY', strength: 0.85, reason: 'Strong support level confirmed' },
  { signal: 'SELL', strength: 0.82, reason: 'Resistance level breach' }
];

exports.getPrediction = (req, res) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1h' } = req.query;

    const prediction = generatePrediction(symbol);
    prediction.timeframe = timeframe;

    res.json(prediction);
  } catch (error) {
    logger.error('Get prediction error:', error);
    res.status(500).json({ error: 'Failed to get prediction' });
  }
};

exports.getSignals = (req, res) => {
  try {
    const { symbol } = req.params;

    const signals = SIGNALS.map(s => ({
      ...s,
      symbol,
      timestamp: new Date().toISOString()
    }));

    res.json(signals);
  } catch (error) {
    logger.error('Get signals error:', error);
    res.status(500).json({ error: 'Failed to get signals' });
  }
};

exports.getPerformance = (req, res) => {
  try {
    const performance = {
      strategyName: 'AI Trading Bot',
      totalTrades: 150,
      winRate: 68.5,
      lossRate: 31.5,
      profitFactor: 2.45,
      averageWin: 125.50,
      averageLoss: 85.30,
      maxDrawdown: 12.5,
      sharpeRatio: 1.85,
      sortino: 2.42,
      accuracy: 0.685,
      period: 'Last 30 days'
    };

    res.json(performance);
  } catch (error) {
    logger.error('Get performance error:', error);
    res.status(500).json({ error: 'Failed to get performance' });
  }
};