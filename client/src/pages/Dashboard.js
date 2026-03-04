import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, BarChart, Bar
} from 'recharts';
import { getCompanies, getPrices } from '../services/api';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

function Dashboard() {
  const [companies, setCompanies] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('SCOM');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCompanies()
      .then(res => setCompanies(res.data))
      .catch(() => setError('Failed to load companies'));
  }, []);

  useEffect(() => {
    if (!selectedTicker) return;
    setLoading(true);
    setError(null);
    getPrices(selectedTicker)
      .then(res => {
        const formatted = res.data.map(p => ({
          ...p,
          date: new Date(p.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }),
          close: parseFloat(p.close),
          volume: parseInt(p.volume),
        }));
        setPrices(formatted);
      })
      .catch(() => setError('Failed to load price data'))
      .finally(() => setLoading(false));
  }, [selectedTicker]);

  const latestPrice = prices.length ? prices[prices.length - 1].close : null;
  const firstPrice = prices.length ? prices[0].close : null;
  const priceChange = latestPrice && firstPrice
    ? ((latestPrice - firstPrice) / firstPrice * 100).toFixed(2) : null;
  const high = prices.length ? Math.max(...prices.map(p => p.close)).toFixed(2) : null;
  const low = prices.length ? Math.min(...prices.map(p => p.close)).toFixed(2) : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Market Dashboard</h1>
          <p className="page-subtitle">Nairobi Securities Exchange — Historical Data</p>
        </div>
        <select
          className="company-select"
          value={selectedTicker}
          onChange={e => setSelectedTicker(e.target.value)}
        >
          {companies.map(c => (
            <option key={c.ticker} value={c.ticker}>{c.ticker} — {c.name}</option>
          ))}
        </select>
      </div>

      <div className="stat-grid">
        <StatCard title="Current Price" value={latestPrice ? `KES ${latestPrice}` : '—'} color="green" />
        <StatCard title="Period Change" value={priceChange ? `${priceChange}%` : '—'} color={priceChange >= 0 ? 'green' : 'red'} />
        <StatCard title="Period High" value={high ? `KES ${high}` : '—'} color="blue" />
        <StatCard title="Period Low" value={low ? `KES ${low}` : '—'} color="yellow" />
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && prices.length > 0 && (
        <>
          <div className="card">
            <h2 className="card-title">{selectedTicker} — Closing Price (KES)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={prices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [`KES ${val}`, 'Close']} />
                <Legend />
                <Line type="monotone" dataKey="close" stroke="#16a34a" strokeWidth={2} dot={false} name="Close Price" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <h2 className="card-title">{selectedTicker} — Trading Volume</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={prices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(val) => [val.toLocaleString(), 'Volume']} />
                <Bar dataKey="volume" fill="#bbf7d0" name="Volume" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="btn-group">
            <button className="btn-primary" onClick={() => navigate(`/fundamentals/${selectedTicker}`)}>
              View Fundamentals →
            </button>
            <button className="btn-outline" onClick={() => navigate(`/forecast/${selectedTicker}`)}>
              View Forecast →
            </button>
          </div>
        </>
      )}

      {!loading && !error && prices.length === 0 && (
        <div className="empty-state">No price data available for {selectedTicker} yet.</div>
      )}
    </div>
  );
}
export default Dashboard;