const mongoose = require('mongoose');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marketplace_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const products = [
    { id: 'PD001', name: 'MacBook Pro M3', price: 35000000 },
    { id: 'PD002', name: 'Samsung S24 Ultra', price: 22000000 },
    { id: 'PD003', name: 'iPad Pro 12.9', price: 18000000 },
    { id: 'PD004', name: 'Apple Watch Ultra', price: 15000000 },
    { id: 'PD005', name: 'AirPods Pro', price: 3500000 }
];

async function clearExistingOrders() {
    try {
        await Order.deleteMany({});
        console.log('Cleared existing orders');
    } catch (error) {
        console.error('Error clearing orders:', error);
        throw error;
    }
}

async function createOrder(userId, productIndex, orderNumber) {
    try {
        // Create Order
        const orderId = `OR${Date.now()}${orderNumber}`;
        const product = products[productIndex];
        const quantity = Math.floor(Math.random() * 3) + 1; // Random quantity 1-3

        const order = await Order.create({
            or_id: orderId,
            or_pd_id: product.id,
            or_us_id: userId,
            or_amount: quantity,
            or_created_at: new Date(),
            or_updated_at: new Date()
        });

        console.log(`Created Order: ${orderId}`);
        console.log('Product:', product.name);
        console.log('Quantity:', quantity);
        console.log('Total Amount:', formatCurrency(product.price * quantity));
        console.log('------------------------');

        return order;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

async function createTestOrders() {
    try {
        // Clear existing orders
        await clearExistingOrders();

        // Get admin user
        const user = await User.findOne({ us_email: 'admin@example.com' });
        if (!user) {
            throw new Error('Admin user not found in database');
        }

        console.log('Creating orders for user:', user.us_email);
        console.log('User ID:', user.us_id);
        console.log('------------------------');

        // Create 5 orders with different products
        const orderData = [
            { productIndex: 0 }, // MacBook Pro M3
            { productIndex: 1 }, // Samsung S24 Ultra
            { productIndex: 2 }, // iPad Pro
            { productIndex: 3 }, // Apple Watch Ultra
            { productIndex: 4 }  // AirPods Pro
        ];

        const createdOrders = [];
        for (let i = 0; i < orderData.length; i++) {
            const order = await createOrder(
                user.us_id,
                orderData[i].productIndex,
                i + 1
            );
            createdOrders.push(order);
        }

        // Verify the created orders
        const orders = await Order.find({ or_us_id: user.us_id });

        console.log('\nVerification Summary:');
        console.log(`Total Orders created: ${orders.length}`);

        console.log('\nAll Orders:');
        orders.forEach(order => {
            const product = products.find(p => p.id === order.or_pd_id);
            console.log(`- Order ${order.or_id}: ${product.name} x${order.or_amount} (${formatCurrency(product.price * order.or_amount)})`);
        });

    } catch (error) {
        console.error('Error in test data creation:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
}

// Run the script
console.log('Starting Test Orders Creation');
console.log('=========================');
createTestOrders();
