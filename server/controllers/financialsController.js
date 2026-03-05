const pool = require('../db/connection');

const getFinancials = async (req, res) => {
  try {
    const [company] = await pool.query(
      'SELECT id FROM companies WHERE ticker = ?',
      [req.params.ticker.toUpperCase()]
    );
    if (company.length === 0) return res.status(404).json({ error: 'Company not found' });

    const [rows] = await pool.query(
      'SELECT * FROM financials WHERE company_id = ? ORDER BY fiscal_year DESC',
      [company[0].id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFinancialRatios = async (req, res) => {
  try {
    const [company] = await pool.query(
      'SELECT id FROM companies WHERE ticker = ?',
      [req.params.ticker.toUpperCase()]
    );
    if (company.length === 0) return res.status(404).json({ error: 'Company not found' });

    const [fin] = await pool.query(
      'SELECT * FROM financials WHERE company_id = ? ORDER BY fiscal_year DESC LIMIT 1',
      [company[0].id]
    );

    const [price] = await pool.query(
      'SELECT close FROM stock_prices WHERE company_id = ? ORDER BY date DESC LIMIT 1',
      [company[0].id]
    );

    // ← Return empty ratios instead of 404 when no data
    if (fin.length === 0) {
      return res.json({
        ticker: req.params.ticker.toUpperCase(),
        fiscal_year: null,
        ratios: {
          pe_ratio: null,
          debt_to_equity: null,
          net_profit_margin: null,
          dividend_yield: null,
        }
      });
    }

    const f = fin[0];
    const currentPrice = price.length > 0 ? price[0].close : null;

    const ratios = {
      pe_ratio: currentPrice && f.eps ? (currentPrice / f.eps).toFixed(2) : null,
      debt_to_equity: f.total_debt && f.total_assets ? (f.total_debt / (f.total_assets - f.total_debt)).toFixed(2) : null,
      net_profit_margin: f.net_income && f.revenue ? ((f.net_income / f.revenue) * 100).toFixed(2) + '%' : null,
      dividend_yield: currentPrice && f.dividends_per_share ? ((f.dividends_per_share / currentPrice) * 100).toFixed(2) + '%' : null,
    };

    res.json({ ticker: req.params.ticker.toUpperCase(), fiscal_year: f.fiscal_year, ratios });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = { getFinancials, getFinancialRatios };