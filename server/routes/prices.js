const express = require('express');
const router = express.Router();
const { getPricesByTicker } = require('../controllers/pricesController');

router.get('/:ticker', getPricesByTicker);

module.exports = router;