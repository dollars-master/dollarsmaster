const express = require('express');
const derivService = require('./src/services/derivService');
const aiTradingEngine = require('./src/services/aiTradingEngine');
const digitsMarketAnalyzer = require('./src/services/digitsMarketAnalyzer');
const logger = require('./src/utils/logger');

// Initialize market data and AI analysis
async function initializeAIEngine() {
  try {
    logger.info('Initializing AI Trading Engine...');

    // Subscribe to key digits markets
    const digitsSymbols = derivService.getDigitsSymbols();
    logger.info(`Monitoring ${digitsSymbols.length} digits markets`);

    // Run market analysis every 30 seconds
    setInterval(async () => {
      try {
        const analysis = await digitsMarketAnalyzer.analyzeAllDigitsMarkets();
        logger.info(`Market analysis complete: ${analysis.marketsAnalyzed} markets analyzed`);
      } catch (error) {
        logger.error('Error in market analysis cycle:', error);
      }
    }, 30000);

    logger.info('AI Trading Engine initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize AI Engine:', error);
  }
}

module.exports = { initializeAIEngine };