const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const auditRoutes = require('./routes/audit');
const errorHandler = require('./utils/errorHandler');

const app = express();

// Security middleware

app.use(helmet());

// Rate limiting

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/audit', limiter);


app.use(cors({
  origin: ['https://page-pulse-qw9n.vercel.app'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/audit', auditRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware

app.use(errorHandler);

module.exports = app;
