const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'SokoMetrics API is running 🟢',
    version: '1.0.0',
    endpoints: {
      companies: '/api/companies',
      prices: '/api/prices/:ticker',
      financials: '/api/financials/:ticker',
      ratios: '/api/financials/:ticker/ratios',
      education: '/api/education/glossary',
    }
  });
});

// ─── Routes ───────────────────────────────────────────────
app.use('/api/companies', require('./routes/companies'));
app.use('/api/prices', require('./routes/prices'));
app.use('/api/financials', require('./routes/financials'));
app.use('/api/education', require('./routes/education'));
app.use('/api/forecast', require('./routes/forecast'));

// ─── 404 Handler ──────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong on the server',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ─── Start Server ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('─────────────────────────────────────');
  console.log(`✅ SokoMetrics API running`);
  console.log(`📡 http://localhost:${PORT}`);
  console.log(`🗄️  Database: ${process.env.DB_NAME}`);
  console.log('─────────────────────────────────────');
});