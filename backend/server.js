const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://health-score-app-alpha.vercel.app',
  ],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));
app.options('*', cors());
app.use(express.json());

// Connect to MongoDB (optional – app works without it)
if (process.env.MONGO_URI) {
  connectDB();
}

// Routes
app.use('/api/health-score', require('./routes/healthRoutes'));
app.use('/api/records',      require('./routes/recordRoutes'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Health Score API is running', version: '1.0.0' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));