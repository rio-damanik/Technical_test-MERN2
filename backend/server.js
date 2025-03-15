const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Main Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/invoices', require('./routes/invoiceRoutes'));

// Dummy Data Routes
const {
    addDummyUsers,
    addDummyProducts,
    addDummyCategories,
    addDummyOrders,
    addDummyInvoices
} = require('./utils/dummyData');

app.post('/api/dummy/users', addDummyUsers);
app.post('/api/dummy/products', addDummyProducts);
app.post('/api/dummy/categories', addDummyCategories);
app.post('/api/dummy/orders', addDummyOrders);
app.post('/api/dummy/invoices', addDummyInvoices);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});