const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');

const authRoutes = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customer');


const app = express();
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url);
  next();
});

// CORS Configuration
// Set CORS_ORIGINS in .env file as comma-separated list, e.g., "http://localhost:3000,http://localhost:3001"
// Or set CORS_ALLOW_ALL=true to allow all origins (not recommended for production)
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    // Allow all origins if CORS_ALLOW_ALL is set
    if (process.env.CORS_ALLOW_ALL === 'true') {
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200, // For legacy browser support
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/customer', customerRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
