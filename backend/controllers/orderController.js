const Order = require('../models/Order');
const Invoice = require('../models/Invoice');
const Product = require('../models/Product');

// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('or_pd_id');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ or_id: req.params.id }).populate('or_pd_id');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new order
exports.createOrder = async (req, res) => {
    try {
        const { or_pd_id, or_amount, or_us_id } = req.body;
        const or_id = "OR" + Date.now();

        // Check if product exists
        const product = await Product.findById(or_pd_id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        const order = await Order.create({
            or_id,
            or_pd_id: product._id,
            or_us_id,
            or_amount: parseInt(or_amount),
            or_created_at: new Date(),
            or_updated_at: new Date()
        });

        const populatedOrder = await Order.findById(order._id).populate('or_pd_id');
        res.status(201).json({ success: true, data: populatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update order
exports.updateOrder = async (req, res) => {
    try {
        const { or_pd_id, or_us_id, or_amount } = req.body;
        const or_id = req.params.id;

        // Check if order exists
        let order = await Order.findOne({ or_id });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if product exists if product ID is being updated
        if (or_pd_id) {
            const product = await Product.findById(or_pd_id);
            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
        }

        // Update only provided fields
        if (or_pd_id) order.or_pd_id = or_pd_id;
        if (or_us_id) order.or_us_id = or_us_id;
        if (or_amount) order.or_amount = parseInt(or_amount);
        order.or_updated_at = new Date();

        await order.save();
        const updatedOrder = await Order.findById(order._id).populate('or_pd_id');
        res.json({ success: true, data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete order
exports.deleteOrder = async (req, res) => {
    try {
        const or_id = req.params.id;

        // Find and delete order
        const order = await Order.findOne({ or_id });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Delete associated invoices
        await Invoice.deleteMany({ inv_or_id: order._id });
        await order.deleteOne();

        res.json({ success: true, message: 'Order and associated invoices deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
