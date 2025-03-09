const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Dummy Data Routes
const {
    addDummyUsers,
    addDummyProducts,
    addDummyCategories,
    addDummyOrders
} = require('./utils/dummyData');

app.post('/api/dummy/users', addDummyUsers);
app.post('/api/dummy/products', addDummyProducts);
app.post('/api/dummy/categories', addDummyCategories);
app.post('/api/dummy/orders', addDummyOrders);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});