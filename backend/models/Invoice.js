const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    inv_id: {
        type: String,
        required: true,
        unique: true
    },
    inv_or_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    inv_us_id: {
        type: String,
        required: true
    },
    inv_amount: {
        type: Number,
        required: true,
        min: 0
    },
    inv_total: {
        type: Number,
        required: true,
        min: 0
    },
    inv_status: {
        type: String,
        required: true,
        enum: ['pending', 'paid', 'cancelled'],
        default: 'pending'
    },
    inv_payment_method: {
        type: String,
        required: true,
        enum: ['cash', 'credit_card', 'bank_transfer']
    },
    inv_date: {
        type: Date,
        default: Date.now
    },
    inv_due_date: {
        type: Date,
        required: true
    }
});

// Add index for faster queries
invoiceSchema.index({ inv_id: 1 });
invoiceSchema.index({ inv_or_id: 1 });
invoiceSchema.index({ inv_status: 1 });

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
