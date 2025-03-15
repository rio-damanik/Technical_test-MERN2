const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    inv_id: {
        type: String,
        required: true,
        unique: true
    },
    inv_or_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order'
    },
    inv_us_id: {
        type: String,
        required: true,
        ref: 'User'
    },
    inv_amount: {
        type: Number,
        required: true
    },
    inv_total: {
        type: Number,
        required: true
    },
    inv_status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    inv_date: {
        type: Date,
        default: Date.now
    },
    inv_due_date: {
        type: Date,
        required: true
    },
    inv_payment_method: {
        type: String,
        enum: ['cash', 'credit_card', 'bank_transfer'],
        required: true
    },
    inv_created_at: {
        type: Date,
        default: Date.now
    },
    inv_updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
