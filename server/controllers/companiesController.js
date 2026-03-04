const pool = require('../db/connection');

const getAllCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM companies');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCompanyByTicker = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM companies WHERE ticker = ?',
      [req.params.ticker.toUpperCase()]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Company not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllCompanies, getCompanyByTicker };