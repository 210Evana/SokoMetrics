import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ComposedChart, Line, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { getPrices } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import API from '../services/api';

function Forecast() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [forecast, setForecast] = useState(null);
  const [historicalPrices, setHistoricalPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      API.get(`/forecast/${ticker}`),
      getPrices(ticker)
    ])
      .then(([forecastRes, pricesRes]) => {
        setForecast(forecastRes.data);

        // Format historical prices
        const historical = pricesRes.data.map(p => ({
          date: new Date(p.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }),
          actual: parseFloat(p.close),
          predicted: null,
          lower_ci: null,
          upper_ci: null,
        }));

        // Format forecast data
        const forecastData = forecastRes.data.forecast.map(f => ({
          date: new Date(f.date).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' }),
          actual: null,
          predicted: f.predicted,
          lower_ci: f.lower_ci,
          upper_ci: f.upper_ci,
        }));

        setHistoricalPrices([...historical, ...forecastData]);
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load forecast data');
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  return (
    <div>
      <button className="btn-back" onClick={() => navigate('/')}>
        ← Back to Dashboard
      </button>

      <h1 className="page-title">{ticker} — Price Forecast</h1>
      <p className="page-subtitle" style={{ marginBottom: '1rem' }}>
        ARIMA statistical model — 14 day forward projection
      </p>

      {/* Disclaimer */}
      <div className="disclaimer">
        ⚠️ <strong>Educational Disclaimer:</strong> Forecasts are generated using
        statistical models (ARIMA) and are for educational purposes only.
        SokoMetrics does not provide financial advice. Do not make investment
        decisions based on these projections.
      </div>

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && forecast && (
        <>
          {/* Forecast Stats */}
          <div className="stat-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card stat-card-green">
              <p className="stat-label">Forecast Horizon</p>
              <p className="stat-value">{forecast.horizon_days} days</p>
            </div>
            <div className="stat-card stat-card-blue">
              <p className="stat-label">First Predicted Price</p>
              <p className="stat-value">
                KES {forecast.forecast[0]?.predicted}
              </p>
            </div>
            <div className="stat-card stat-card-yellow">
              <p className="stat-label">Last Predicted Price</p>
              <p className="stat-value">
                KES {forecast.forecast[forecast.forecast.length - 1]?.predicted}
              </p>
            </div>
            <div className="stat-card stat-card-green">
              <p className="stat-label">Model</p>
              <p className="stat-value" style={{ fontSize: '1rem' }}>ARIMA(1,1,1)</p>
            </div>
          </div>

          {/* Chart */}
          <div className="card">
            <h2 className="card-title">
              {ticker} — Historical + 14-Day Forecast (KES)
            </h2>
            <ResponsiveContainer width="100%" height={380}>
              <ComposedChart data={historicalPrices}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  interval={2}
                />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  formatter={(val, name) => {
                    if (val === null) return ['—', name];
                    return [`KES ${val}`, name];
                  }}
                />
                <Legend />

                {/* Historical price — solid green line */}
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#16a34a"
                  strokeWidth={2}
                  dot={false}
                  name="Actual Price"
                  connectNulls={false}
                />

                {/* Confidence band — shaded area */}
                <Area
                  type="monotone"
                  dataKey="upper_ci"
                  stroke="none"
                  fill="#bbf7d0"
                  fillOpacity={0.4}
                  name="Upper Confidence"
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="lower_ci"
                  stroke="none"
                  fill="#ffffff"
                  fillOpacity={1}
                  name="Lower Confidence"
                  connectNulls={false}
                />

                {/* Forecast line — dashed */}
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  dot={{ r: 3, fill: '#f59e0b' }}
                  name="Forecast"
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Table */}
          <div className="card">
            <h2 className="card-title">Forecast Table</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Predicted Price (KES)</th>
                    <th>Lower Bound</th>
                    <th>Upper Bound</th>
                  </tr>
                </thead>
                <tbody>
                  {forecast.forecast.map((f, i) => (
                    <tr key={i}>
                      <td>{f.date}</td>
                      <td><strong>{f.predicted}</strong></td>
                      <td style={{ color: '#dc2626' }}>{f.lower_ci}</td>
                      <td style={{ color: '#16a34a' }}>{f.upper_ci}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Forecast;