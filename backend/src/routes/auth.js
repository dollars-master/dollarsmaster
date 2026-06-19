const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateEmail, validatePassword } = require('../middleware/validation');

// Public routes
router.post('/register', validateEmail, validatePassword, authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);

module.exports = router;