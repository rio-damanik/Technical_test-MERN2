const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper function to format user data
const formatUserResponse = (user) => ({
    us_id: user.us_id,
    us_name: user.us_name,
    us_email: user.us_email,
    us_phone_number: user.us_phone_number,
    us_address: user.us_address
});

exports.register = async (req, res) => {
    try {
        const { us_name, us_email, us_password, us_phone_number, us_address } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ us_email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        const hashedPassword = await bcrypt.hash(us_password, 10);
        const us_id = 'USR' + Date.now();

        const user = await User.create({
            us_id,
            us_name,
            us_email,
            us_password: hashedPassword,
            us_phone_number,
            us_address
        });

        // Create token
        const token = jwt.sign(
            { id: user.us_id }, 
            'your_jwt_secret', 
            { expiresIn: '24h' }
        );

        res.status(201).json({ 
            success: true, 
            data: {
                user: formatUserResponse(user),
                token
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { us_email, us_password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ us_email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(us_password, user.us_password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Create token
        const token = jwt.sign(
            { id: user.us_id }, 
            'your_jwt_secret', 
            { expiresIn: '24h' }
        );

        res.status(200).json({ 
            success: true, 
            data: {
                user: formatUserResponse(user),
                token
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-us_password');
        res.status(200).json({ 
            success: true, 
            data: users.map(formatUserResponse)
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findOne({ us_id: req.params.id }).select('-us_password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ 
            success: true, 
            data: formatUserResponse(user)
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { us_name, us_email, us_password, us_phone_number, us_address } = req.body;
        
        // Find user first
        const user = await User.findOne({ us_id: req.params.id });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check if email is being changed and if it's already taken
        if (us_email && us_email !== user.us_email) {
            const existingUser = await User.findOne({ us_email });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Email already in use' 
                });
            }
        }

        // Prepare update data
        const updateData = {
            us_name: us_name || user.us_name,
            us_email: us_email || user.us_email,
            us_phone_number: us_phone_number || user.us_phone_number,
            us_address: us_address || user.us_address
        };

        // If password is being updated, hash it
        if (us_password) {
            updateData.us_password = await bcrypt.hash(us_password, 10);
        }

        // Update user
        const updatedUser = await User.findOneAndUpdate(
            { us_id: req.params.id },
            updateData,
            { new: true }
        ).select('-us_password');

        res.status(200).json({ 
            success: true, 
            data: formatUserResponse(updatedUser)
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({ us_id: req.params.id });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await User.findOneAndDelete({ us_id: req.params.id });

        res.status(200).json({ 
            success: true, 
            message: 'User deleted successfully',
            data: formatUserResponse(user)
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
