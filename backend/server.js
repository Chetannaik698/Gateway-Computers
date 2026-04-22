const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// ── Middleware ──
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [
  clientUrl,
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
  'https://www.gatewaycomputers.shop',
  'https://gatewaycomputers.shop',
  'https://gateway-computers.vercel.app',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ── Routes ──
app.use('/api/auth',     require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
app.use('/api/contacts', require('./routes/contact.routes'));
app.use('/api/services', require('./routes/service.routes'));
app.use('/api/orders',   require('./routes/order.routes'));
app.use('/api/razorpay', require('./routes/razorpay.routes'));

// ── Health check ──
app.get('/', (req, res) => {
  res.json({ message: 'Gateway Computers API is running ✅', status: 'ok' });
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// ── MongoDB + Start server ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
