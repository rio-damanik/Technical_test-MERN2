const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testCredentials = [
    {
        email: 'staff@example.com',
        password: 'staff123'
    },
    {
        email: 'customer@example.com',
        password: 'customer123'
    }
];

async function testLogin() {
    console.log('Testing Login Functionality');
    console.log('-------------------------');
    
    for (const cred of testCredentials) {
        try {
            console.log(`\nTesting login for: ${cred.email}`);
            const response = await axios.post(`${API_URL}/users/login`, {
                us_email: cred.email,
                us_password: cred.password
            });
            
            console.log('Login successful!');
            console.log('User details:');
            console.log('Name:', response.data.data.user.us_name);
            console.log('Email:', response.data.data.user.us_email);
            console.log('Token received:', !!response.data.data.token);
        } catch (error) {
            console.error(`\nLogin failed for ${cred.email}:`);
            if (error.response) {
                console.error('Error:', error.response.data.message || error.response.data.error);
            } else if (error.request) {
                console.error('Error: No response from server. Is the server running?');
            } else {
                console.error('Error:', error.message);
            }
        }
    }
    
    console.log('\nLogin testing completed.');
}

testLogin();
