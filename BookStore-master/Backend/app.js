const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const reportRoutes = require('./routes/report.routes'); // Admin only
const customerRoutes = require('./routes/customer.routes');
const authorRoutes = require('./routes/author.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/authors', authorRoutes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;