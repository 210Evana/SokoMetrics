import { useEffect, useState } from 'react';
import { getGlossary } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const METRICS = [
  { term: 'P/E Ratio', description: 'Price-to-Earnings ratio shows how much investors pay per shilling of earnings. A lower P/E can mean the stock is undervalued.', category: 'Valuation' },
  { term: 'Debt-to-Equity', description: 'Compares total debt to shareholder equity. A high ratio means the company relies heavily on debt — higher risk.', category: 'Risk' },
  { term: 'Net Profit Margin', description: 'Percentage of revenue that becomes profit. Higher margin = more efficient company.', category: 'Profitability' },
  { term: 'Dividend Yield', description: 'Annual dividend as a percentage of share price. Important for income-focused investors.', category: 'Income' },
  { term: 'EPS', description: 'Earnings Per Share — profit divided by number of shares. Higher EPS generally signals a stronger company.', category: 'Profitability' },
  { term: 'Moving Average', description: 'Average closing price over a set period (e.g. 20 days). Smooths out noise and helps identify trends.', category: 'Technical' },
];

function Education() {
  const [glossary, setGlossary] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGlossary()
      .then(res => setGlossary(res.data))
      .catch(() => setError('Failed to load glossary'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = glossary.filter(g =>
    g.term.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">Financial Education</h1>
      <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
        Learn the key concepts behind investing in the Nairobi Securities Exchange.
      </p>

      <h2 className="card-title">Key Metrics Explained</h2>
      <div className="metrics-grid">
        {METRICS.map((m, i) => (
          <div key={i} className="metric-card">
            <div className="metric-card-header">
              <span className="metric-name">{m.term}</span>
              <span className="metric-badge">{m.category}</span>
            </div>
            <p className="metric-desc">{m.description}</p>
          </div>
        ))}
      </div>

      <h2 className="card-title">Glossary</h2>
      <input
        className="search-input"
        type="text"
        placeholder="Search terms..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          No glossary terms yet. Add them via DBeaver into the glossary table.
        </div>
      )}

      <div className="glossary-grid">
        {filtered.map((g, i) => (
          <div key={i} className="glossary-card">
            <p className="glossary-term">{g.term}</p>
            <p className="glossary-def">{g.definition}</p>
            {g.example && <p className="glossary-example">Example: {g.example}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
export default Education;