const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');

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
                us_id: 'USR001', // Unique ID for the user
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

const updateDummyUsers = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('No users to update');
            return;
        }

        const updatedUsers = [
            {
                us_id: 'USR001', // Unique ID for the user
                us_name: 'Updated Admin User',
                us_email: 'updated_admin@example.com',
                us_password: await bcrypt.hash('newpassword123', 10), // Ensure to hash this before saving
                us_phone_number: '987-654-3210',
                us_address: '456 Updated Street, Updated City, Updated State',
            },
            // Add more users to update if needed
        ];

        for (const user of updatedUsers) {
            await User.findOneAndUpdate({ us_id: user.us_id }, user, { new: true });
        }

        console.log('Dummy users updated successfully');
    } catch (error) {
        console.error('Error updating dummy users:', error);
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
                or_us_id: users[1]._id,
                or_amount: 1
            },
            {
                or_pd_id: products[1]._id,
                or_us_id: users[2]._id,
                or_amount: 2
            },
            {
                or_pd_id: products[2]._id,
                or_us_id: users[1]._id,
                or_amount: 1
            }
        ];

        await Order.insertMany(orders);
        console.log('Dummy orders created successfully');
    } catch (error) {
        console.error('Error creating dummy orders:', error);
    }
};

const initializeDummyData = async () => {
    console.log('Initializing dummy data...');
    await addDummyUsers();
    await addDummyCategories();
    await addDummyProducts();
    await addDummyOrders();
    console.log('Dummy data initialization completed');
};

module.exports = { initializeDummyData, addDummyUsers, updateDummyUsers, addDummyCategories, addDummyProducts, addDummyOrders };