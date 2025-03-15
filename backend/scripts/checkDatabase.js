const mongoose = require('mongoose');
const User = require('../models/User');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marketplace_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

async function checkDatabase() {
    try {
        // Check Users
        console.log('\nChecking Users:');
        console.log('==============');
        const users = await User.find();
        console.log(`Total users: ${users.length}`);
        users.forEach(user => {
            console.log(`- ${user.us_name} (${user.us_email}) [ID: ${user.us_id}]`);
        });

        // Check Orders
        console.log('\nChecking Orders:');
        console.log('==============');
        const orders = await Order.find();
        console.log(`Total orders: ${orders.length}`);
        orders.forEach(order => {
            console.log(`- Order ${order.or_id}: Amount ${order.or_amount} for user ${order.or_us_id}`);
        });

        // Check Invoices
        console.log('\nChecking Invoices:');
        console.log('===============');
        const invoices = await Invoice.find();
        console.log(`Total invoices: ${invoices.length}`);
        invoices.forEach(invoice => {
            console.log(`- Invoice ${invoice.inv_id}: Total ${invoice.inv_total} (${invoice.inv_status})`);
        });

    } catch (error) {
        console.error('Error checking database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
}

// Run the check
console.log('Database Check');
console.log('==============');
checkDatabase();
