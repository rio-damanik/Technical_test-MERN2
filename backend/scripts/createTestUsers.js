const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/marketplace_db')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB connection error:', err));

const testUsers = [
    {
        us_name: 'Admin User',
        us_email: 'admin@example.com',
        us_password: 'admin123',
        us_phone_number: '081234567890',
        us_address: 'Jakarta, Indonesia'
    },
    {
        us_name: 'Staff User',
        us_email: 'staff@example.com',
        us_password: 'staff123',
        us_phone_number: '081234567891',
        us_address: 'Bandung, Indonesia'
    },
    {
        us_name: 'Customer User',
        us_email: 'customer@example.com',
        us_password: 'customer123',
        us_phone_number: '081234567892',
        us_address: 'Surabaya, Indonesia'
    }
];

async function createUsers() {
    try {
        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');

        for (const userData of testUsers) {
            const us_id = 'USR' + Date.now();
            const hashedPassword = await bcrypt.hash(userData.us_password, 10);
            
            const user = await User.create({
                us_id,
                us_name: userData.us_name,
                us_email: userData.us_email,
                us_password: hashedPassword,
                us_phone_number: userData.us_phone_number,
                us_address: userData.us_address
            });

            console.log(`Created user: ${user.us_name}`);
            console.log(`Email: ${user.us_email}`);
            console.log(`ID: ${user.us_id}`);
            console.log('------------------------');
        }

        console.log('All test users created successfully');
    } catch (error) {
        console.error('Error creating test users:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\nMongoDB connection closed');
    }
}

// Run the script
console.log('Creating Test Users');
console.log('==================');
createUsers();
