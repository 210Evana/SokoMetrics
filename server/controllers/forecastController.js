const pool = require('../db/connection');
const axios = require('axios');

const getForecast = async (req, res) => {
  try {
    const [company] = await pool.query(
      'SELECT id FROM companies WHERE ticker = ?',
      [req.params.ticker.toUpperCase()]
    );
    if (company.length === 0) return res.status(404).json({ error: 'Company not found' });

    // Get last 60 days of prices
    const [prices] = await pool.query(
      'SELECT date, close FROM stock_prices WHERE company_id = ? ORDER BY date DESC LIMIT 60',
      [company[0].id]
    );

    if (prices.length < 10) {
      return res.status(400).json({ error: 'Not enough price data for forecast. Need at least 10 days.' });
    }

    // Format dates properly
    const priceData = prices.reverse().map(p => ({
      date: new Date(p.date).toISOString().split('T')[0],
      close: parseFloat(p.close)
    }));

    // Call Python ML service
    const mlResponse = await axios.post('http://127.0.0.1:8000/forecast', {
      ticker: req.params.ticker.toUpperCase(),
      prices: priceData,
      days: 14
    });

    res.json(mlResponse.data);

  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      return res.status(503).json({ error: 'ML service is not running. Start it with: python -m uvicorn main:app --port 8000' });
    }
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getForecast };