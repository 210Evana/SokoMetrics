const express = require('express');
const router = express.Router();
const { getAllCompanies, getCompanyByTicker } = require('../controllers/companiesController');

router.get('/', getAllCompanies);
router.get('/:ticker', getCompanyByTicker);

module.exports = router;