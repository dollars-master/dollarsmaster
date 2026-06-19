const axios = require('axios');
const logger = require('../utils/logger');

const DERIV_API_URL = 'wss://ws.binaryws.com/websockets/v3';
const DERIV_APP_ID = process.env.DERIV_APP_ID || '1';

// Real Deriv market symbols including Digits markets
const DERIV_SYMBOLS = {
  // Forex
  'EURUSD': { name: 'EUR/USD', category: 'forex', type: 'standard' },
  'GBPUSD': { name: 'GBP/USD', category: 'forex', type: 'standard' },
  'USDJPY': { name: 'USD/JPY', category: 'forex', type: 'standard' },
  'AUDUSD': { name: 'AUD/USD', category: 'forex', type: 'standard' },
  'USDCAD': { name: 'USD/CAD', category: 'forex', type: 'standard' },
  
  // Commodities
  'GOLD': { name: 'Gold Spot', category: 'commodities', type: 'standard' },
  'OIL_WTI': { name: 'WTI Oil', category: 'commodities', type: 'standard' },
  'OIL_BRENT': { name: 'Brent Oil', category: 'commodities', type: 'standard' },
  
  // Indices
  'US500': { name: 'US 500', category: 'indices', type: 'standard' },
  'US100': { name: 'US 100', category: 'indices', type: 'standard' },
  'UK100': { name: 'UK 100', category: 'indices', type: 'standard' },
  'EU50': { name: 'EU 50', category: 'indices', type: 'standard' },
  'JP225': { name: 'Japan 225', category: 'indices', type: 'standard' },
  
  // Cryptocurrencies
  'BTCUSD': { name: 'Bitcoin', category: 'crypto', type: 'standard' },
  'ETHUSD': { name: 'Ethereum', category: 'crypto', type: 'standard' },
  'LTCUSD': { name: 'Litecoin', category: 'crypto', type: 'standard' },
  'XRPUSD': { name: 'Ripple', category: 'crypto', type: 'standard' },
  
  // Digits Markets (Jump, Step, Match/Differ)
  'JUMP10IDX': { name: 'Jump 10 Index', category: 'digits', type: 'digits', volatility: 10 },
  'JUMP25IDX': { name: 'Jump 25 Index', category: 'digits', type: 'digits', volatility: 25 },
  'JUMP50IDX': { name: 'Jump 50 Index', category: 'digits', type: 'digits', volatility: 50 },
  'JUMP75IDX': { name: 'Jump 75 Index', category: 'digits', type: 'digits', volatility: 75 },
  'JUMP100IDX': { name: 'Jump 100 Index', category: 'digits', type: 'digits', volatility: 100 },
  
  'STEP10IDX': { name: 'Step 10 Index', category: 'digits', type: 'digits', volatility: 10 },
  'STEP25IDX': { name: 'Step 25 Index', category: 'digits', type: 'digits', volatility: 25 },
  'STEP50IDX': { name: 'Step 50 Index', category: 'digits', type: 'digits', volatility: 50 },
  'STEP75IDX': { name: 'Step 75 Index', category: 'digits', type: 'digits', volatility: 75 },
  'STEP100IDX': { name: 'Step 100 Index', category: 'digits', type: 'digits', volatility: 100 },
};

class DerivService {
  constructor() {
    this.ws = null;
    this.messageId = 1;
    this.subscriptions = new Map();
    this.priceHistory = new Map();
    this.maxHistorySize = 100;
  }

  // Connect to Deriv WebSocket API
  async connect(apiToken = null) {
    return new Promise((resolve, reject) => {
      try {
        const WebSocket = require('ws');
        this.ws = new WebSocket(DERIV_API_URL);

        this.ws.on('open', () => {
          logger.info('Connected to Deriv API');
          
          // Authorize if token provided
          if (apiToken) {
            this.authorize(apiToken);
          }
          
          resolve(true);
        });

        this.ws.on('message', (data) => {
          this.handleMessage(JSON.parse(data));
        });

        this.ws.on('error', (error) => {
          logger.error('WebSocket error:', error);
          reject(error);
        });

        this.ws.on('close', () => {
          logger.info('Disconnected from Deriv API');
        });
      } catch (error) {
        logger.error('Connection error:', error);
        reject(error);
      }
    });
  }

  // Send message to Deriv API
  send(payload) {
    if (!this.ws || this.ws.readyState !== 1) {
      logger.warn('WebSocket not connected');
      return null;
    }

    const message = {
      ...payload,
      req_id: this.messageId++
    };

    this.ws.send(JSON.stringify(message));
    return message.req_id;
  }

  // Handle incoming messages
  handleMessage(message) {
    if (message.tick) {
      this.handleTick(message.tick);
    } else if (message.candles) {
      this.handleCandles(message.candles);
    } else if (message.authorize) {
      logger.info('Authorization successful');
    } else if (message.error) {
      logger.error('API Error:', message.error);
    }
  }

  // Handle tick (price update)
  handleTick(tick) {
    const { symbol, quote, ask, bid } = tick;
    
    // Store price in history
    if (!this.priceHistory.has(symbol)) {
      this.priceHistory.set(symbol, []);
    }
    
    const history = this.priceHistory.get(symbol);
    history.push({
      timestamp: Date.now(),
      bid: bid || quote,
      ask: ask || quote,
      mid: ((bid || quote) + (ask || quote)) / 2
    });
    
    // Keep only recent history
    if (history.length > this.maxHistorySize) {
      history.shift();
    }
  }

  // Handle candles
  handleCandles(candles) {
    // Store candle data for analysis
    logger.info(`Received ${candles.length} candles`);
  }

  // Authorize user
  authorize(token) {
    this.send({
      authorize: token
    });
  }

  // Get all available symbols
  getAllSymbols() {
    return DERIV_SYMBOLS;
  }

  // Get symbols by category
  getSymbolsByCategory(category) {
    return Object.entries(DERIV_SYMBOLS)
      .filter(([_, data]) => data.category === category)
      .map(([symbol, data]) => ({
        symbol,
        ...data
      }));
  }

  // Get Digits symbols specifically
  getDigitsSymbols() {
    return this.getSymbolsByCategory('digits');
  }

  // Subscribe to market data
  subscribeToPrices(symbols, callback) {
    if (!Array.isArray(symbols)) {
      symbols = [symbols];
    }

    symbols.forEach(symbol => {
      this.send({
        ticks: symbol,
        subscribe: 1
      });
      this.subscriptions.set(symbol, callback);
    });
  }

  // Get price history
  getPriceHistory(symbol) {
    return this.priceHistory.get(symbol) || [];
  }

  // Calculate technical indicators
  calculateIndicators(symbol) {
    const history = this.priceHistory.get(symbol) || [];
    if (history.length < 2) return null;

    const closes = history.map(h => h.mid);
    const current = closes[closes.length - 1];
    const previous = closes[closes.length - 2];

    // Moving Average
    const sma = closes.length >= 20 
      ? closes.slice(-20).reduce((a, b) => a + b) / 20 
      : closes.reduce((a, b) => a + b) / closes.length;

    // RSI
    const rsi = this.calculateRSI(closes);

    // MACD
    const macd = this.calculateMACD(closes);

    // Bollinger Bands
    const bb = this.calculateBollingerBands(closes);

    return {
      symbol,
      current,
      sma,
      rsi,
      macd,
      bollingerBands: bb,
      trend: current > sma ? 'up' : 'down',
      momentum: current - previous
    };
  }

  // Calculate RSI (Relative Strength Index)
  calculateRSI(closes, period = 14) {
    if (closes.length < period + 1) return 50;

    let gains = 0, losses = 0;
    for (let i = closes.length - period; i < closes.length; i++) {
      const change = closes[i] - closes[i - 1];
      if (change > 0) gains += change;
      else losses += Math.abs(change);
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return Math.round(rsi);
  }

  // Calculate MACD
  calculateMACD(closes) {
    const ema12 = this.calculateEMA(closes, 12);
    const ema26 = this.calculateEMA(closes, 26);
    const macdLine = ema12 - ema26;
    const signalLine = this.calculateEMA([macdLine], 9);
    const histogram = macdLine - signalLine;

    return {
      macdLine: parseFloat(macdLine.toFixed(6)),
      signalLine: parseFloat(signalLine.toFixed(6)),
      histogram: parseFloat(histogram.toFixed(6))
    };
  }

  // Calculate EMA (Exponential Moving Average)
  calculateEMA(closes, period) {
    const multiplier = 2 / (period + 1);
    let ema = closes.slice(0, period).reduce((a, b) => a + b) / period;

    for (let i = period; i < closes.length; i++) {
      ema = (closes[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  // Calculate Bollinger Bands
  calculateBollingerBands(closes, period = 20) {
    const sma = closes.slice(-period).reduce((a, b) => a + b) / period;
    const variance = closes.slice(-period)
      .reduce((sum, val) => sum + Math.pow(val - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);

    return {
      upper: parseFloat((sma + 2 * stdDev).toFixed(6)),
      middle: parseFloat(sma.toFixed(6)),
      lower: parseFloat((sma - 2 * stdDev).toFixed(6))
    };
  }

  // Generate trading signal
  generateSignal(symbol) {
    const indicators = this.calculateIndicators(symbol);
    if (!indicators) return null;

    const { rsi, macd, bollingerBands, current } = indicators;
    let signal = 'HOLD';
    let strength = 0;
    let reasons = [];

    // RSI signals
    if (rsi < 30) {
      signal = 'BUY';
      strength += 0.3;
      reasons.push('RSI oversold');
    } else if (rsi > 70) {
      signal = 'SELL';
      strength += 0.3;
      reasons.push('RSI overbought');
    }

    // MACD signals
    if (macd.histogram > 0 && macd.macdLine > macd.signalLine) {
      if (signal !== 'SELL') signal = 'BUY';
      strength += 0.35;
      reasons.push('MACD bullish crossover');
    } else if (macd.histogram < 0 && macd.macdLine < macd.signalLine) {
      signal = 'SELL';
      strength += 0.35;
      reasons.push('MACD bearish crossover');
    }

    // Bollinger Bands signals
    if (current < bollingerBands.lower) {
      if (signal !== 'SELL') signal = 'BUY';
      strength += 0.35;
      reasons.push('Price below lower band');
    } else if (current > bollingerBands.upper) {
      signal = 'SELL';
      strength += 0.35;
      reasons.push('Price above upper band');
    }

    return {
      symbol,
      signal: signal || 'HOLD',
      strength: Math.min(1, strength),
      confidence: Math.round(strength * 100),
      reasons,
      indicators
    };
  }

  // Close connection
  disconnect() {
    if (this.ws) {
      this.ws.close();
      logger.info('Disconnected from Deriv API');
    }
  }
}

module.exports = new DerivService();