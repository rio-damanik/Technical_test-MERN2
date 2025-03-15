const mongoose = require('mongoose');
require('dotenv').config();
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const Product = require('../models/Product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/marketplace_db';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const products = [
    { 
        _id: new mongoose.Types.ObjectId(),
        pd_id: 'PD001',
        pd_code: 'MACM3',
        pd_ct_id: 'CAT001',
        pd_name: 'MacBook Pro M3',
        pd_price: 35000000,
        pd_created_at: new Date(),
        pd_updated_at: new Date()
    },
    { 
        _id: new mongoose.Types.ObjectId(),
        pd_id: 'PD002',
        pd_code: 'S24U',
        pd_ct_id: 'CAT001',
        pd_name: 'Samsung S24 Ultra',
        pd_price: 22000000,
        pd_created_at: new Date(),
        pd_updated_at: new Date()
    },
    { 
        _id: new mongoose.Types.ObjectId(),
        pd_id: 'PD003',
        pd_code: 'IPADM2',
        pd_ct_id: 'CAT001',
        pd_name: 'iPad Pro 12.9',
        pd_price: 18000000,
        pd_created_at: new Date(),
        pd_updated_at: new Date()
    },
    { 
        _id: new mongoose.Types.ObjectId(),
        pd_id: 'PD004',
        pd_code: 'AWULTRA',
        pd_ct_id: 'CAT002',
        pd_name: 'Apple Watch Ultra',
        pd_price: 15000000,
        pd_created_at: new Date(),
        pd_updated_at: new Date()
    },
    { 
        _id: new mongoose.Types.ObjectId(),
        pd_id: 'PD005',
        pd_code: 'AIRPODSP',
        pd_ct_id: 'CAT002',
        pd_name: 'AirPods Pro',
        pd_price: 3500000,
        pd_created_at: new Date(),
        pd_updated_at: new Date()
    }
];

const paymentMethods = ['cash', 'credit_card', 'bank_transfer'];
const invoiceStatuses = ['pending', 'paid', 'cancelled'];

async function clearExistingData() {
    try {
        await Order.deleteMany({});
        await Invoice.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing orders, invoices, and products');
    } catch (error) {
        console.error('Error clearing data:', error);
        throw error;
    }
}

async function seedProducts() {
    try {
        const createdProducts = await Product.insertMany(products);
        console.log('Products seeded successfully:');
        createdProducts.forEach(product => {
            console.log(`- ${product.pd_name} (${product.pd_code}): ${formatCurrency(product.pd_price)}`);
        });
        return createdProducts;
    } catch (error) {
        console.error('Error seeding products:', error);
        throw error;
    }
}

async function createOrderAndInvoice(userId, product, orderNumber, status) {
    try {
        // Create Order
        const orderId = `OR${Date.now()}${orderNumber}`;
        const quantity = Math.floor(Math.random() * 3) + 1; // Random quantity 1-3
        const totalAmount = product.pd_price * quantity;

        const order = await Order.create({
            or_id: orderId,
            or_pd_id: product._id,
            or_us_id: userId,
            or_amount: quantity,
            or_created_at: new Date(),
            or_updated_at: new Date()
        });

        console.log(`Created Order: ${orderId}`);
        console.log('Product:', product.pd_name);
        console.log('Quantity:', quantity);
        console.log('Amount:', formatCurrency(totalAmount));

        // Create Invoice
        const invoiceId = `INV${Date.now()}${orderNumber}`;
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7); // Due date 7 days from now

        const invoice = await Invoice.create({
            inv_id: invoiceId,
            inv_or_id: order._id,
            inv_us_id: userId,
            inv_amount: product.pd_price,
            inv_total: totalAmount,
            inv_status: status,
            inv_date: new Date(),
            inv_due_date: dueDate,
            inv_payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)]
        });

        console.log(`Created Invoice: ${invoiceId}`);
        console.log('Total Amount:', formatCurrency(totalAmount));
        console.log('Due Date:', formatDate(dueDate));
        console.log('Status:', invoice.inv_status);
        console.log('Payment Method:', invoice.inv_payment_method);
        console.log('------------------------');

        return { order, invoice };
    } catch (error) {
        console.error('Error creating order and invoice:', error);
        throw error;
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short'
    }).format(date);
}

async function seedData() {
    try {
        // Clear existing data
        await clearExistingData();

        // Seed products
        const seededProducts = await seedProducts();
        console.log('\n------------------------');

        // Get admin user
        const user = await User.findOne({ us_email: 'admin@example.com' });
        if (!user) {
            throw new Error('Admin user not found in database');
        }

        console.log('Creating orders and invoices for user:', user.us_email);
        console.log('User ID:', user.us_id);
        console.log('------------------------');

        // Create 5 orders and invoices with different statuses
        const orderData = [
            { product: seededProducts[0], status: 'pending' },   // MacBook Pro - Pending
            { product: seededProducts[1], status: 'paid' },      // Samsung - Paid
            { product: seededProducts[2], status: 'pending' },   // iPad - Pending
            { product: seededProducts[3], status: 'cancelled' }, // Apple Watch - Cancelled
            { product: seededProducts[4], status: 'paid' }       // AirPods - Paid
        ];

        for (let i = 0; i < orderData.length; i++) {
            await createOrderAndInvoice(
                user.us_id,
                orderData[i].product,
                i + 1,
                orderData[i].status
            );
        }

        // Verify the created data
        const orders = await Order.find({ or_us_id: user.us_id })
            .populate('or_pd_id');
        const invoices = await Invoice.find({ inv_us_id: user.us_id })
            .populate({
                path: 'inv_or_id',
                populate: {
                    path: 'or_pd_id'
                }
            });

        console.log('\nVerification Summary:');
        console.log(`Total Orders created: ${orders.length}`);
        console.log(`Total Invoices created: ${invoices.length}`);

        console.log('\nAll Orders:');
        for (const order of orders) {
            console.log(`- Order ${order.or_id}: ${order.or_pd_id.pd_name} x${order.or_amount}`);
        }

        console.log('\nAll Invoices:');
        for (const invoice of invoices) {
            console.log(`- Invoice ${invoice.inv_id}: ${formatCurrency(invoice.inv_total)} (${invoice.inv_status})`);
        }

    } catch (error) {
        console.error('Error in seeding data:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
}

// Run the seeder
console.log('Starting Data Seeding');
console.log('=========================');
seedData();
