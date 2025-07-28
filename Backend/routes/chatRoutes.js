const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticateToken } = require('../middleware/auth');

router.post('/ask', authenticateToken, chatController.askQuestion);
router.get('/history/:sessionId', authenticateToken, chatController.getChatHistory);

module.exports = router;