const express = require('express');
const router = express.Router();
const { getForecast } = require('../controllers/forecastController');

router.get('/:ticker', getForecast);

module.exports = router;