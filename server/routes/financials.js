const express = require('express');
const router = express.Router();
const { getFinancials, getFinancialRatios } = require('../controllers/financialsController');

router.get('/:ticker', getFinancials);
router.get('/:ticker/ratios', getFinancialRatios);

module.exports = router;