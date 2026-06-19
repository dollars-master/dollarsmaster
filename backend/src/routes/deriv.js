const express = require('express');
const router = express.Router();
const derivController = require('../controllers/derivController');
const authMiddleware = require('../middleware/auth');

// Protected routes
router.get('/markets', authMiddleware, derivController.getMarkets);
router.get('/symbols/:symbol/quotes', authMiddleware, derivController.getQuotes);
router.get('/account/balance', authMiddleware, derivController.getBalance);
router.post('/account/connect', authMiddleware, derivController.connectAccount);

module.exports = router;