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
  { term: 'Market Cap', description: 'Total value of a company = share price × total shares. Larger cap generally means more stable company.', category: 'Valuation' },
  { term: 'Volatility', description: 'How much a stock price moves up and down. High volatility = higher risk but also higher potential reward.', category: 'Risk' },
];

const RISK_LEVELS = [
  { level: 'Low Risk', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', description: 'Blue chip companies like Safaricom and Equity Bank. Stable earnings, consistent dividends, high liquidity.', examples: 'SCOM, EQTY, KCB' },
  { level: 'Medium Risk', color: '#ca8a04', bg: '#fefce8', border: '#fef08a', description: 'Mid-cap companies with growth potential but less stability. Prices can swing more significantly.', examples: 'EABL, Co-op Bank, BAT Kenya' },
  { level: 'High Risk', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', description: 'Small cap or struggling companies. High potential returns but also high chance of significant losses.', examples: 'KPLC, small cap NSE stocks' },
];

const NSE_TIPS = [
  { icon: '📋', title: 'Open a CDS Account', tip: 'You must open a Central Depository System account through a licensed stockbroker before buying any NSE shares.' },
  { icon: '🏦', title: 'Use a Licensed Broker', tip: 'Only trade through CMA-licensed brokers. Check the CMA Kenya website for the official list of approved brokers.' },
  { icon: '📊', title: 'Start with Blue Chips', tip: 'As a beginner, start with well-known companies like Safaricom, Equity Bank or KCB before exploring smaller stocks.' },
  { icon: '🔄', title: 'Diversify Your Portfolio', tip: 'Never put all your money in one stock or sector. Spread across Telecom, Banking, Energy and Consumer sectors.' },
  { icon: '📅', title: 'Think Long Term', tip: 'The NSE rewards patient investors. Short-term trading is risky. Aim for a 3-5 year minimum holding period.' },
  { icon: '💰', title: 'Reinvest Dividends', tip: 'Use dividend payments to buy more shares. This compounds your returns significantly over time.' },
];

const CATEGORIES = ['All', 'Valuation', 'Risk', 'Profitability', 'Income', 'Technical', 'Market Conditions', 'Investing', 'Market Structure', 'Regulation', 'Fixed Income', 'Market Index', 'Trading', 'Risk Management', 'Corporate Actions', 'Market Events'];

function Education() {
  const [glossary, setGlossary] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('metrics');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getGlossary()
      .then(res => setGlossary(res.data))
      .catch(() => setError('Failed to load glossary'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = glossary.filter(g => {
    const matchSearch = g.term.toLowerCase().includes(search.toLowerCase()) ||
      g.definition.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' || g.category === activeCategory;
    return matchSearch && matchCategory;
  });

  const tabs = [
    { key: 'metrics', label: '📊 Key Metrics' },
    { key: 'risk', label: '⚠️ Risk Guide' },
    { key: 'tips', label: '💡 NSE Tips' },
    { key: 'glossary', label: '📖 Glossary' },
  ];

  return (
    <div>
      <h1 className="page-title">Financial Education</h1>
      <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
        Everything you need to understand investing on the Nairobi Securities Exchange.
      </p>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #e5e7eb', paddingBottom: '0' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: '0.6rem 1.2rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: activeTab === tab.key ? '#15803d' : '#6b7280',
              borderBottom: activeTab === tab.key ? '2px solid #15803d' : '2px solid transparent',
              marginBottom: '-2px',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1 — Key Metrics */}
      {activeTab === 'metrics' && (
        <div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            These are the core numbers every investor must understand before buying any stock.
          </p>
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

          {/* How to read SokoMetrics */}
          <div className="card" style={{ marginTop: '1rem' }}>
            <h2 className="card-title">📈 How to Read SokoMetrics Data</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Green stat card', meaning: 'Positive or healthy indicator' },
                { label: 'Red stat card', meaning: 'Warning — needs attention' },
                { label: 'Dashed forecast line', meaning: 'Predicted price — not guaranteed' },
                { label: 'Shaded area on forecast', meaning: 'Confidence interval — probable range' },
                { label: 'N/A on ratios', meaning: 'Not enough data entered yet' },
                { label: 'Volume bars', meaning: 'How many shares traded that day' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ color: '#15803d', fontWeight: '700', minWidth: '140px', fontSize: '0.85rem' }}>{item.label}</span>
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>{item.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2 — Risk Guide */}
      {activeTab === 'risk' && (
        <div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Understanding risk is the most important skill for any investor. Every stock carries risk — the goal is to understand and manage it.
          </p>

          {/* Risk Levels */}
          <h2 className="card-title">Risk Levels Explained</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {RISK_LEVELS.map((r, i) => (
              <div key={i} style={{ background: r.bg, border: `1px solid ${r.border}`, borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '700', color: r.color, fontSize: '1rem' }}>{r.level}</span>
                </div>
                <p style={{ color: '#374151', fontSize: '0.875rem', marginBottom: '0.4rem' }}>{r.description}</p>
                <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Examples: <strong>{r.examples}</strong></p>
              </div>
            ))}
          </div>

          {/* Risk Factors */}
          <div className="card">
            <h2 className="card-title">⚡ What Affects NSE Stock Prices</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { factor: 'CBK Interest Rates', impact: 'Higher rates → investors prefer bonds → stock prices fall' },
                { factor: 'Kenya Shilling Rate', impact: 'Weak KES → import costs rise → company profits squeezed' },
                { factor: 'Inflation', impact: 'High inflation → consumer spending drops → company revenues fall' },
                { factor: 'Political Stability', impact: 'Elections or unrest → investor uncertainty → market volatility' },
                { factor: 'Company Earnings', impact: 'Better than expected profits → share price rises' },
                { factor: 'Global Markets', impact: 'US or China market crashes → NSE often follows downward' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                  <p style={{ fontWeight: '600', color: '#374151', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{item.factor}</p>
                  <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>{item.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer" style={{ marginTop: '1rem' }}>
            ⚠️ SokoMetrics risk scores are educational estimates only. Always consult a CMA-licensed financial advisor before making investment decisions.
          </div>
        </div>
      )}

      {/* TAB 3 — NSE Tips */}
      {activeTab === 'tips' && (
        <div>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Practical steps and tips specifically for investing on the Nairobi Securities Exchange.
          </p>

          <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
            {NSE_TIPS.map((tip, i) => (
              <div key={i} className="metric-card">
                <div style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>{tip.icon}</div>
                <h3 style={{ fontWeight: '700', color: '#15803d', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{tip.title}</h3>
                <p className="metric-desc">{tip.tip}</p>
              </div>
            ))}
          </div>

          {/* Beginner Checklist */}
          <div className="card">
            <h2 className="card-title">✅ Beginner Investor Checklist</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'I understand that investing carries risk and I can lose money',
                'I have an emergency fund before I start investing',
                'I have opened a CDS account with a licensed NSE broker',
                'I understand the difference between shares, bonds and dividends',
                'I have researched the company before buying its shares',
                'I am investing money I will not need for at least 3 years',
                'I understand how to read basic financial ratios',
                'I have a diversified portfolio across at least 3 sectors',
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.6rem 0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                  <span style={{ color: '#15803d', fontWeight: '700', fontSize: '1.1rem', marginTop: '-1px' }}>☐</span>
                  <span style={{ color: '#374151', fontSize: '0.875rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4 — Glossary */}
      {activeTab === 'glossary' && (
        <div>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
              className="search-input"
              style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}
              type="text"
              placeholder="Search terms or definitions..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="company-select"
              value={activeCategory}
              onChange={e => setActiveCategory(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <p style={{ color: '#9ca3af', fontSize: '0.8rem', marginBottom: '1rem' }}>
            {filtered.length} term{filtered.length !== 1 ? 's' : ''} found
          </p>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}

          {!loading && filtered.length === 0 && (
            <div className="empty-state">No terms found matching your search.</div>
          )}

          <div className="glossary-grid">
            {filtered.map((g, i) => (
              <div key={i} className="glossary-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                  <p className="glossary-term">{g.term}</p>
                  {g.category && (
                    <span style={{ fontSize: '0.7rem', background: '#f0fdf4', color: '#15803d', padding: '0.15rem 0.5rem', borderRadius: '99px', whiteSpace: 'nowrap', marginLeft: '0.5rem' }}>
                      {g.category}
                    </span>
                  )}
                </div>
                <p className="glossary-def">{g.definition}</p>
                {g.example && <p className="glossary-example">Example: {g.example}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Education;