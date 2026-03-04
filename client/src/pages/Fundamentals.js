import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompany, getFinancials, getRatios } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Fundamentals() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [financials, setFinancials] = useState([]);
  const [ratios, setRatios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([getCompany(ticker), getFinancials(ticker), getRatios(ticker)])
      .then(([compRes, finRes, ratioRes]) => {
        setCompany(compRes.data);
        setFinancials(finRes.data);
        setRatios(ratioRes.data.ratios);
      })
      .catch(() => setError('Failed to load fundamental data'))
      .finally(() => setLoading(false));
  }, [ticker]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <button className="btn-back" onClick={() => navigate('/')}>← Back to Dashboard</button>
      <h1 className="page-title">{company?.name}</h1>
      <p className="page-subtitle">{company?.sector} — {ticker}</p>
      {company?.description && (
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.5rem', marginBottom: '1.5rem', maxWidth: '600px' }}>
          {company.description}
        </p>
      )}

      {ratios && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 className="card-title">Financial Ratios</h2>
          <div className="ratio-grid">
            <StatCard title="P/E Ratio" value={ratios.pe_ratio ?? 'N/A'} subtitle="Price to Earnings" color="green" />
            <StatCard title="Debt to Equity" value={ratios.debt_to_equity ?? 'N/A'} subtitle="Lower is safer" color="blue" />
            <StatCard title="Net Profit Margin" value={ratios.net_profit_margin ?? 'N/A'} subtitle="Profitability" color="green" />
            <StatCard title="Dividend Yield" value={ratios.dividend_yield ?? 'N/A'} subtitle="Annual return" color="yellow" />
          </div>
        </div>
      )}

      <div className="card">
        <h2 className="card-title">Annual Financials</h2>
        {financials.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No financial data available yet.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Revenue (KES)</th>
                  <th>Net Income (KES)</th>
                  <th>Total Debt (KES)</th>
                  <th>EPS</th>
                </tr>
              </thead>
              <tbody>
                {financials.map((f, i) => (
                  <tr key={i}>
                    <td><strong>{f.fiscal_year}</strong></td>
                    <td>{f.revenue ? Number(f.revenue).toLocaleString() : '—'}</td>
                    <td>{f.net_income ? Number(f.net_income).toLocaleString() : '—'}</td>
                    <td>{f.total_debt ? Number(f.total_debt).toLocaleString() : '—'}</td>
                    <td>{f.eps ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Fundamentals;