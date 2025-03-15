const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: 'inv_or_id',
                populate: { path: 'or_pd_id' }
            });
        res.json({ success: true, data: invoices });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get single invoice
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ inv_id: req.params.id })
            .populate({
                path: 'inv_or_id',
                populate: { path: 'or_pd_id' }
            });

        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        res.json({ success: true, data: invoice });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Create new invoice
exports.createInvoice = async (req, res) => {
    try {
        const { inv_or_id, inv_payment_method } = req.body;

        // Find order by or_id
        const order = await Order.findOne({ or_id: inv_or_id }).populate('or_pd_id');
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check if invoice already exists for this order
        const existingInvoice = await Invoice.findOne({ inv_or_id: order._id });
        if (existingInvoice) {
            return res.status(400).json({ success: false, message: 'Invoice already exists for this order' });
        }

        // Calculate total amount
        const inv_amount = order.or_pd_id.pd_price;
        const inv_total = inv_amount * order.or_amount;

        // Set due date to 7 days from now
        const inv_due_date = new Date();
        inv_due_date.setDate(inv_due_date.getDate() + 7);

        const invoice = await Invoice.create({
            inv_id: 'INV' + Date.now(),
            inv_or_id: order._id,
            inv_us_id: order.or_us_id,
            inv_amount,
            inv_total,
            inv_status: 'pending',
            inv_payment_method,
            inv_date: new Date(),
            inv_due_date
        });

        const populatedInvoice = await Invoice.findById(invoice._id)
            .populate({
                path: 'inv_or_id',
                populate: { path: 'or_pd_id' }
            });

        res.status(201).json({ success: true, data: populatedInvoice });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
    try {
        const { inv_status, inv_payment_method } = req.body;
        const inv_id = req.params.id;

        // Find invoice
        const invoice = await Invoice.findOne({ inv_id });
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        // Update only allowed fields
        if (inv_status) {
            if (!['pending', 'paid', 'cancelled'].includes(inv_status)) {
                return res.status(400).json({ success: false, message: 'Invalid invoice status' });
            }
            invoice.inv_status = inv_status;
        }

        if (inv_payment_method) {
            if (!['cash', 'credit_card', 'bank_transfer'].includes(inv_payment_method)) {
                return res.status(400).json({ success: false, message: 'Invalid payment method' });
            }
            invoice.inv_payment_method = inv_payment_method;
        }

        await invoice.save();

        const updatedInvoice = await Invoice.findById(invoice._id)
            .populate({
                path: 'inv_or_id',
                populate: { path: 'or_pd_id' }
            });

        res.json({ success: true, data: updatedInvoice });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const inv_id = req.params.id;

        const invoice = await Invoice.findOne({ inv_id });
        if (!invoice) {
            return res.status(404).json({ success: false, message: 'Invoice not found' });
        }

        await invoice.deleteOne();
        res.json({ success: true, message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
