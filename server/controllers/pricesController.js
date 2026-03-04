const pool = require('../db/connection');

const getPricesByTicker = async (req, res) => {
  try {
    const [company] = await pool.query(
      'SELECT id FROM companies WHERE ticker = ?',
      [req.params.ticker.toUpperCase()]
    );
    if (company.length === 0) return res.status(404).json({ error: 'Company not found' });

    const { from, to } = req.query;
    let query = 'SELECT * FROM stock_prices WHERE company_id = ?';
    const params = [company[0].id];

    if (from) { query += ' AND date >= ?'; params.push(from); }
    if (to)   { query += ' AND date <= ?'; params.push(to); }
    query += ' ORDER BY date ASC';

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPricesByTicker };