const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    or_id: {
        type: String,
        required: true,
        unique: true
    },
    or_pd_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    or_us_id: {
        type: String,
        required: true
    },
    or_amount: {
        type: Number,
        required: true,
        min: 1
    },
    or_created_at: {
        type: Date,
        default: Date.now
    },
    or_updated_at: {
        type: Date,
        default: Date.now
    }
});

// Add index for faster queries
orderSchema.index({ or_id: 1 });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;