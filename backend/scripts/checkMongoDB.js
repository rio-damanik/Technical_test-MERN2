const mongoose = require('mongoose');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');
const User = require('../models/User');

mongoose.connect('mongodb://127.0.0.1:27017/marketplace_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

async function checkDatabase() {
    try {
        // Check Users
        const users = await User.find({});
        console.log('\nUsers in Database:', users.length);
        users.forEach(user => {
            console.log(`- ${user.us_email} (${user.us_id})`);
        });

        // Check Products
        const products = await Product.find({});
        console.log('\nProducts in Database:', products.length);
        products.forEach(product => {
            console.log(`- ${product.pd_name} (${product.pd_code}): ${formatCurrency(product.pd_price)}`);
        });

        // Check Orders
        const orders = await Order.find({});
        console.log('\nOrders in Database:', orders.length);
        orders.forEach(order => {
            console.log(`- Order ${order.or_id}: Product ${order.or_pd_id} x${order.or_amount}`);
        });

        // Check Invoices
        const invoices = await Invoice.find({});
        console.log('\nInvoices in Database:', invoices.length);
        invoices.forEach(invoice => {
            console.log(`- Invoice ${invoice.inv_id}: ${formatCurrency(invoice.inv_total)} (${invoice.inv_status})`);
        });

    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

console.log('Checking Database Status');
console.log('=======================');
checkDatabase();
