const logger = require('../utils/logger');
const derivService = require('./derivService');

class AITradingEngine {
  constructor() {
    this.activeStrategies = new Map();
    this.tradeHistory = [];
    this.signals = new Map();
  }

  // Analyze market using AI indicators
  async analyzeMarket(symbol) {
    try {
      logger.info(`Analyzing market for ${symbol}`);

      // Get technical indicators
      const signal = derivService.generateSignal(symbol);
      if (!signal) {
        return {
          symbol,
          error: 'Insufficient data'
        };
      }

      // Store signal
      this.signals.set(symbol, signal);

      // Predict price movement
      const prediction = this.predictPriceMovement(symbol, signal);

      return {
        symbol,
        signal: signal.signal,
        confidence: signal.confidence,
        strength: signal.strength,
        reasons: signal.reasons,
        prediction,
        indicators: signal.indicators,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error(`Error analyzing market for ${symbol}:`, error);
      return { symbol, error: error.message };
    }
  }

  // Predict price movement
  predictPriceMovement(symbol, signal) {
    const indicators = signal.indicators;
    if (!indicators) return null;

    const { current, sma, rsi, macd, bollingerBands } = indicators;
    let direction = signal.signal === 'BUY' ? 'up' : signal.signal === 'SELL' ? 'down' : 'neutral';
    let confidence = signal.confidence / 100;

    // Calculate target price
    const volatility = Math.abs(bollingerBands.upper - bollingerBands.lower);
    const target = direction === 'up' 
      ? current + (volatility * 0.5)
      : direction === 'down' 
        ? current - (volatility * 0.5)
        : current;

    // Calculate stop loss
    const stopLoss = direction === 'up'
      ? current - (volatility * 0.3)
      : current + (volatility * 0.3);

    return {
      direction,
      confidence: Math.round(confidence * 100),
      currentPrice: parseFloat(current.toFixed(6)),
      targetPrice: parseFloat(target.toFixed(6)),
      stopLoss: parseFloat(stopLoss.toFixed(6)),
      riskRewardRatio: Math.abs(target - current) / Math.abs(current - stopLoss)
    };
  }

  // Execute automatic trade
  async executeTrade(symbol, strategy) {
    try {
      const analysis = await this.analyzeMarket(symbol);
      
      if (!analysis.signal || analysis.signal === 'HOLD') {
        return {
          executed: false,
          reason: 'No clear signal or HOLD signal'
        };
      }

      const tradeConfig = {
        symbol,
        direction: analysis.signal === 'BUY' ? 'call' : 'put',
        amount: strategy.amount || 10,
        duration: strategy.duration || 3600,
        durationUnit: 'seconds',
        riskLevel: strategy.riskLevel || 'medium',
        analysis,
        executedAt: new Date(),
        expectedProfit: this.calculateExpectedProfit(analysis, strategy.amount)
      };

      this.tradeHistory.push(tradeConfig);
      logger.info(`Trade executed: ${symbol} - ${tradeConfig.direction}`);

      return {
        executed: true,
        trade: tradeConfig
      };
    } catch (error) {
      logger.error(`Error executing trade for ${symbol}:`, error);
      return {
        executed: false,
        error: error.message
      };
    }
  }

  // Calculate expected profit
  calculateExpectedProfit(analysis, amount) {
    const winProbability = analysis.confidence / 100;
    const avgWin = amount * 0.85; // 85% return
    const avgLoss = -amount;
    const expectedValue = (winProbability * avgWin) + ((1 - winProbability) * avgLoss);

    return {
      expectedValue,
      winProbability: Math.round(winProbability * 100),
      potentialProfit: Math.round(avgWin),
      potentialLoss: Math.round(avgLoss)
    };
  }

  // Get all signals
  getAllSignals() {
    return Array.from(this.signals.values());
  }

  // Get signal for specific symbol
  getSignal(symbol) {
    return this.signals.get(symbol);
  }

  // Get trade history
  getTradeHistory(limit = 50) {
    return this.tradeHistory.slice(-limit);
  }

  // Calculate strategy performance
  getStrategyPerformance(symbol = null) {
    const trades = symbol 
      ? this.tradeHistory.filter(t => t.symbol === symbol)
      : this.tradeHistory;

    if (trades.length === 0) {
      return {
        totalTrades: 0,
        winRate: 0,
        profitFactor: 0,
        averageProfit: 0
      };
    }

    const wins = trades.filter(t => t.expectedProfit.expectedValue > 0).length;
    const totalProfit = trades.reduce((sum, t) => sum + t.expectedProfit.expectedValue, 0);

    return {
      totalTrades: trades.length,
      wins,
      losses: trades.length - wins,
      winRate: Math.round((wins / trades.length) * 100),
      totalProfit: Math.round(totalProfit),
      averageProfit: Math.round(totalProfit / trades.length),
      profitFactor: this.calculateProfitFactor(trades)
    };
  }

  // Calculate profit factor
  calculateProfitFactor(trades) {
    let grossProfit = 0;
    let grossLoss = 0;

    trades.forEach(trade => {
      if (trade.expectedProfit.expectedValue > 0) {
        grossProfit += trade.expectedProfit.expectedValue;
      } else {
        grossLoss += Math.abs(trade.expectedProfit.expectedValue);
      }
    });

    return grossLoss > 0 ? grossProfit / grossLoss : 0;
  }
}

module.exports = new AITradingEngine();