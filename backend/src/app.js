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

// Disable ETag to always return 200 instead of 304 (prevents caching issues with fetch-based clients)
app.set('etag', false);

// Middlewares
app.use(cors({
  origin: function (origin, callback) {
    // Definimos los orígenes permitidos por defecto
    const allowedOrigins = [
      'http://localhost:4200',
      'https://proyecto-angular-frontend-one.vercel.app'
    ];

    // Si hay variable de entorno, la partimos por comas y la agregamos
    if (process.env.CORS_ORIGIN) {
      const envOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
      allowedOrigins.push(...envOrigins);
    }

    // Permitimos peticiones sin origin (como postman/curl) o si el origen está en la lista
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/products', productRoutes);
app.use('/api/movements', movementRoutes);

// General fallback or healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InvenTech API is running perfectly' });
});

module.exports = app;
