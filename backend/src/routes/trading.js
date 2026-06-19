const express = require('express');
const router = express.Router();
const tradingController = require('../controllers/tradingController');
const authMiddleware = require('../middleware/auth');

// Protected routes
router.post('/trades', authMiddleware, tradingController.createTrade);
router.get('/trades', authMiddleware, tradingController.getTrades);
router.get('/trades/:tradeId', authMiddleware, tradingController.getTrade);
router.post('/trades/:tradeId/close', authMiddleware, tradingController.closeTrade);
router.get('/portfolio', authMiddleware, tradingController.getPortfolio);

module.exports = router;