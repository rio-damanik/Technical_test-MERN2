const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Invoice = require('../models/Invoice');

const addDummyUsers = async () => {
    try {
        // Check if users exist
        const userCount = await User.countDocuments();
        if (userCount > 0) {
            console.log('Users already exist');
            return;
        }

        const hashedPassword = await bcrypt.hash('password123', 10);
        const users = [
            {
                us_name: 'Admin User',
                us_email: 'admin@example.com',
                us_password: hashedPassword,
                us_phone_number: '123-456-7890',
                us_address: '123 Admin Street, Admin City, Admin State',
            },
            {
                us_name: 'John Doe',
                us_email: 'john@example.com',
                us_password: hashedPassword,
                us_phone_number: '0987654321',
                us_address: '123 Main St, City'
            },
            {
                us_name: 'Jane Smith',
                us_email: 'jane@example.com',
                us_password: hashedPassword,
                us_phone_number: '5555555555',
                us_address: '456 Oak St, City'
            }
        ];

        await User.insertMany(users);
        console.log('Dummy users created successfully');
    } catch (error) {
        console.error('Error creating dummy users:', error);
    }
};

const addDummyCategories = async () => {
    try {
        // Check if categories exist
        const categoryCount = await Category.countDocuments();
        if (categoryCount > 0) {
            console.log('Categories already exist');
            return;
        }

        const categories = [
            {
                ct_name: 'Electronics',
                ct_code: 'ELEC'
            },
            {
                ct_name: 'Clothing',
                ct_code: 'CLTH'
            },
            {
                ct_name: 'Books',
                ct_code: 'BOOK'
            },
            {
                ct_name: 'Home & Garden',
                ct_code: 'HOME'
            }
        ];

        await Category.insertMany(categories);
        console.log('Dummy categories created successfully');
    } catch (error) {
        console.error('Error creating dummy categories:', error);
    }
};

const addDummyProducts = async () => {
    try {
        // Check if products exist
        const productCount = await Product.countDocuments();
        if (productCount > 0) {
            console.log('Products already exist');
            return;
        }

        // Get category IDs
        const categories = await Category.find();
        
        const products = [
            {
                pd_name: 'Smartphone',
                pd_code: 'SP001',
                pd_price: 599.99,
                pd_ct_id: categories.find(c => c.ct_code === 'ELEC')._id
            },
            {
                pd_name: 'T-Shirt',
                pd_code: 'TS001',
                pd_price: 19.99,
                pd_ct_id: categories.find(c => c.ct_code === 'CLTH')._id
            },
            {
                pd_name: 'Novel Book',
                pd_code: 'BK001',
                pd_price: 9.99,
                pd_ct_id: categories.find(c => c.ct_code === 'BOOK')._id
            },
            {
                pd_name: 'Garden Tools Set',
                pd_code: 'HG001',
                pd_price: 49.99,
                pd_ct_id: categories.find(c => c.ct_code === 'HOME')._id
            }
        ];

        await Product.insertMany(products);
        console.log('Dummy products created successfully');
    } catch (error) {
        console.error('Error creating dummy products:', error);
    }
};

const addDummyOrders = async () => {
    try {
        // Check if orders exist
        const orderCount = await Order.countDocuments();
        if (orderCount > 0) {
            console.log('Orders already exist');
            return;
        }

        // Get product IDs and user IDs
        const products = await Product.find();
        const users = await User.find();

        const orders = [
            {
                or_pd_id: products[0]._id,
                or_us_id: users[0]._id,
                or_amount: 2,
                or_status: 'completed'
            },
            {
                or_pd_id: products[1]._id,
                or_us_id: users[1]._id,
                or_amount: 1,
                or_status: 'pending'
            },
            {
                or_pd_id: products[2]._id,
                or_us_id: users[2]._id,
                or_amount: 3,
                or_status: 'completed'
            }
        ];

        const savedOrders = await Order.insertMany(orders);
        console.log('Dummy orders created successfully');
        return savedOrders;
    } catch (error) {
        console.error('Error creating dummy orders:', error);
    }
};

const addDummyInvoices = async () => {
    try {
        // Get existing orders and users
        const orders = await Order.find().populate('or_pd_id').populate('or_us_id');
        const users = await User.find();

        if (!orders.length || !users.length) {
            console.log('No orders or users found. Please create orders and users first.');
            return;
        }

        // Create three different invoices
        const invoices = [
            {
                inv_id: 'INV001',
                inv_or_id: orders[0]._id,
                inv_us_id: users[0]._id,
                inv_amount: 2,
                inv_total: 500,
                inv_status: 'paid',
                inv_payment_method: 'bank_transfer',
                inv_date: new Date(),
                inv_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            },
            {
                inv_id: 'INV002',
                inv_or_id: orders[0]._id,
                inv_us_id: users[0]._id,
                inv_amount: 3,
                inv_total: 750,
                inv_status: 'pending',
                inv_payment_method: 'credit_card',
                inv_date: new Date(),
                inv_due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
            },
            {
                inv_id: 'INV003',
                inv_or_id: orders[0]._id,
                inv_us_id: users[0]._id,
                inv_amount: 1,
                inv_total: 250,
                inv_status: 'paid',
                inv_payment_method: 'cash',
                inv_date: new Date(),
                inv_due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) // 1 day from now
            }
        ];

        // Delete existing invoices
        await Invoice.deleteMany({});

        // Create new invoices
        await Invoice.insertMany(invoices);
        console.log('Dummy invoices created successfully');
    } catch (error) {
        console.error('Error creating dummy invoices:', error);
    }
};

const initializeDummyData = async () => {
    console.log('Initializing dummy data...');
    await addDummyUsers();
    await addDummyCategories();
    await addDummyProducts();
    await addDummyOrders();
    await addDummyInvoices();
    console.log('Dummy data initialization completed');
};

module.exports = { 
    initializeDummyData, 
    addDummyUsers, 
    addDummyCategories, 
    addDummyProducts, 
    addDummyOrders,
    addDummyInvoices
};