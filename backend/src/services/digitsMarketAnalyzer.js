const logger = require('../utils/logger');
const derivService = require('./derivService');
const aiTradingEngine = require('./aiTradingEngine');

class DigitsMarketAnalyzer {
  constructor() {
    this.digitsSymbols = [
      'JUMP10IDX', 'JUMP25IDX', 'JUMP50IDX', 'JUMP75IDX', 'JUMP100IDX',
      'STEP10IDX', 'STEP25IDX', 'STEP50IDX', 'STEP75IDX', 'STEP100IDX'
    ];
    this.analysis = new Map();
  }

  // Analyze all digits markets
  async analyzeAllDigitsMarkets() {
    try {
      logger.info('Analyzing all Digits markets');
      
      const results = await Promise.all(
        this.digitsSymbols.map(symbol => this.analyzeDigitsMarket(symbol))
      );

      return {
        timestamp: new Date().toISOString(),
        marketsAnalyzed: this.digitsSymbols.length,
        analysis: results.filter(r => !r.error),
        errors: results.filter(r => r.error)
      };
    } catch (error) {
      logger.error('Error analyzing digits markets:', error);
      return { error: error.message };
    }
  }

  // Analyze single digits market
  async analyzeDigitsMarket(symbol) {
    try {
      const signal = derivService.generateSignal(symbol);
      
      if (!signal) {
        return { symbol, error: 'Insufficient data' };
      }

      const marketInfo = derivService.getAllSymbols()[symbol];
      const prediction = aiTradingEngine.predictPriceMovement(symbol, signal);

      const analysis = {
        symbol,
        name: marketInfo.name,
        volatility: marketInfo.volatility,
        signal: signal.signal,
        confidence: signal.confidence,
        strength: signal.strength,
        reasons: signal.reasons,
        prediction,
        indicators: signal.indicators,
        recommendation: this.getRecommendation(signal, marketInfo.volatility),
        timestamp: new Date().toISOString()
      };

      this.analysis.set(symbol, analysis);
      return analysis;
    } catch (error) {
      logger.error(`Error analyzing ${symbol}:`, error);
      return { symbol, error: error.message };
    }
  }

  // Get trading recommendation for digits market
  getRecommendation(signal, volatility) {
    const { signal: signalType, confidence, reasons } = signal;
    
    let recommendation = {
      action: signalType,
      confidence,
      volatility,
      tradeType: this.selectTradeType(volatility, signalType),
      riskLevel: this.assessRiskLevel(volatility, confidence),
      suggestedAmount: this.suggestTradeAmount(volatility, confidence),
      duration: this.suggestDuration(volatility),
      reasons
    };

    return recommendation;
  }

  // Select appropriate trade type for digits market
  selectTradeType(volatility, signal) {
    if (volatility <= 25) {
      return 'STEP'; // Use Step index for low volatility
    } else if (volatility >= 75) {
      return 'JUMP'; // Use Jump index for high volatility
    } else {
      return signal === 'BUY' || signal === 'SELL' ? 'JUMP' : 'STEP';
    }
  }

  // Assess risk level
  assessRiskLevel(volatility, confidence) {
    if (confidence >= 80 && volatility <= 50) {
      return 'low';
    } else if (confidence >= 70 && volatility <= 75) {
      return 'medium';
    } else {
      return 'high';
    }
  }

  // Suggest trade amount based on volatility and confidence
  suggestTradeAmount(volatility, confidence) {
    const baseAmount = 10;
    const volatilityFactor = 1 - (volatility / 200);
    const confidenceFactor = confidence / 100;
    const suggestedAmount = baseAmount * volatilityFactor * confidenceFactor;

    return Math.max(1, Math.min(1000, Math.round(suggestedAmount)));
  }

  // Suggest duration for trade
  suggestDuration(volatility) {
    // Higher volatility = shorter duration
    if (volatility >= 75) {
      return 60; // 1 minute
    } else if (volatility >= 50) {
      return 300; // 5 minutes
    } else if (volatility >= 25) {
      return 900; // 15 minutes
    } else {
      return 1800; // 30 minutes
    }
  }

  // Execute automatic trade on digits market
  async executeDigitsTrade(symbol, manualOverride = null) {
    try {
      const analysis = this.analysis.get(symbol);
      if (!analysis) {
        const newAnalysis = await this.analyzeDigitsMarket(symbol);
        if (newAnalysis.error) {
          return { executed: false, error: newAnalysis.error };
        }
      }

      const currentAnalysis = this.analysis.get(symbol);
      const recommendation = currentAnalysis.recommendation;

      // Check if we should execute
      if (recommendation.confidence < 60 && !manualOverride) {
        return {
          executed: false,
          reason: `Low confidence (${recommendation.confidence}%)`
        };
      }

      const trade = {
        symbol,
        type: recommendation.tradeType,
        direction: recommendation.action === 'BUY' ? 'call' : 'put',
        amount: recommendation.suggestedAmount,
        duration: recommendation.duration,
        volatility: recommendation.volatility,
        confidence: recommendation.confidence,
        riskLevel: recommendation.riskLevel,
        reasons: recommendation.reasons,
        executedAt: new Date(),
        analysis: currentAnalysis
      };

      logger.info(`Digits trade executed: ${symbol} (${recommendation.tradeType})`);

      return {
        executed: true,
        trade
      };
    } catch (error) {
      logger.error(`Error executing digits trade for ${symbol}:`, error);
      return {
        executed: false,
        error: error.message
      };
    }
  }

  // Get best performing digits markets
  getBestPerformingMarkets(limit = 5) {
    const analyses = Array.from(this.analysis.values());
    return analyses
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, limit);
  }

  // Get market signals for manual traders
  getSignalsForManualTraders() {
    const analyses = Array.from(this.analysis.values());
    
    return {
      timestamp: new Date().toISOString(),
      strongBuySignals: analyses.filter(a => a.signal === 'BUY' && a.confidence >= 75),
      strongSellSignals: analyses.filter(a => a.signal === 'SELL' && a.confidence >= 75),
      moderateSignals: analyses.filter(a => a.signal !== 'HOLD' && a.confidence >= 60 && a.confidence < 75),
      allAnalysis: analyses
    };
  }
}

module.exports = new DigitsMarketAnalyzer();