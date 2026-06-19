const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const authMiddleware = require('../middleware/auth');

// Protected routes
router.get('/predict/:symbol', authMiddleware, analysisController.getPrediction);
router.get('/signals/:symbol', authMiddleware, analysisController.getSignals);
router.get('/performance', authMiddleware, analysisController.getPerformance);

module.exports = router;