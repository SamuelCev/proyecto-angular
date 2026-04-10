const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');
const movementRoutes = require('./routes/movementRoutes');
const authRoutes = require('./routes/authRoutes');
const { verifyToken } = require('./middlewares/authMiddleware');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', verifyToken, supplierRoutes);
app.use('/api/products', verifyToken, productRoutes);
app.use('/api/movements', verifyToken, movementRoutes);

// General fallback or healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InvenTech API is running perfectly' });
});

module.exports = app;
