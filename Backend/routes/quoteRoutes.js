const express = require('express');
const router = express.Router();
const { fetchQuotesByCategory } = require('../controllers/quoteController');

router.get('/:category', fetchQuotesByCategory);

module.exports = router;