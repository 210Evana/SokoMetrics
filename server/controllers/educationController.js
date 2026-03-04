const pool = require('../db/connection');

const getGlossary = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM glossary ORDER BY term ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getTermByName = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM glossary WHERE term LIKE ?',
      [`%${req.params.term}%`]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Term not found' });
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getGlossary, getTermByName };