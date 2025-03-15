const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    us_id: {
        type: String,
        required: true,
        unique: true
    },
    us_name: {
        type: String,
        required: true
    },
    us_email: {
        type: String,
        required: true,
        unique: true
    },
    us_password: {
        type: String,
        required: true
    },
    us_phone_number: { // Add phone number field
        type: String,
        required: false // Make this optional if you want
    },
    us_address: { // Add address field
        type: String,
        required: false // Make this optional if you want
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;