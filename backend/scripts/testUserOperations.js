const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testUserOperations() {
    console.log('Testing User Operations');
    console.log('---------------------');

    try {
        // 1. Create a test user
        console.log('\n1. Creating test user...');
        const createResponse = await axios.post(`${API_URL}/users/register`, {
            us_name: 'Test User',
            us_email: 'test.user@example.com',
            us_password: 'test123',
            us_phone_number: '081234567893',
            us_address: 'Test Address, Indonesia'
        });
        
        const userId = createResponse.data.data.user.us_id;
        console.log('User created successfully:', createResponse.data.data.user);

        // 2. Update the user
        console.log('\n2. Updating user...');
        const updateResponse = await axios.put(`${API_URL}/users/${userId}`, {
            us_name: 'Updated Test User',
            us_phone_number: '081234567894'
        });
        console.log('User updated successfully:', updateResponse.data.data);

        // 3. Get the updated user
        console.log('\n3. Getting updated user...');
        const getResponse = await axios.get(`${API_URL}/users/${userId}`);
        console.log('Retrieved user:', getResponse.data.data);

        // 4. Delete the user
        console.log('\n4. Deleting user...');
        const deleteResponse = await axios.delete(`${API_URL}/users/${userId}`);
        console.log('User deleted successfully:', deleteResponse.data);

        // 5. Verify deletion
        console.log('\n5. Verifying deletion...');
        try {
            await axios.get(`${API_URL}/users/${userId}`);
            console.error('Error: User still exists after deletion!');
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log('Success: User no longer exists');
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error('\nOperation failed:');
        if (error.response) {
            console.error('Error:', error.response.data.message || error.response.data.error);
        } else if (error.request) {
            console.error('Error: No response from server. Is the server running?');
        } else {
            console.error('Error:', error.message);
        }
    }
}

// Run the test
console.log('Starting User Operations Test');
console.log('============================');
testUserOperations();
