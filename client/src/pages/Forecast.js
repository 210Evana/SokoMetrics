import { useParams, useNavigate } from 'react-router-dom';

function Forecast() {
  const { ticker } = useParams();
  const navigate = useNavigate();
  return (
    <div>
      <button className="btn-back" onClick={() => navigate('/')}>← Back to Dashboard</button>
      <h1 className="page-title">{ticker} — Price Forecast</h1>
      <div className="disclaimer" style={{ marginTop: '1rem' }}>
        ⚠️ <strong>Educational Disclaimer:</strong> Forecasts are generated using statistical
        models (ARIMA) and are for educational purposes only. SokoMetrics does not provide
        financial advice. Do not make investment decisions based on these projections.
      </div>
      <div className="card empty-state">
        🔧 Forecast module coming soon — ML microservice integration in progress.
      </div>
    </div>
  );
}
export default Forecast;