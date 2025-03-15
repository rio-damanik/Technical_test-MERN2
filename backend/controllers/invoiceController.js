const Invoice = require('../models/Invoice');
const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Create new invoice
exports.createInvoice = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { inv_or_id, inv_payment_method } = req.body;

        // Get order details with product information
        const order = await Order.findOne({ or_id: inv_or_id })
            .populate('or_pd_id');

        if (!order) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!order.or_pd_id) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Product not found for this order'
            });
        }

        // Calculate total using product price
        const total = order.or_amount * order.or_pd_id.pd_price;

        // Generate invoice ID
        const inv_id = 'INV' + Date.now();

        // Set due date to 7 days from now
        const due_date = new Date();
        due_date.setDate(due_date.getDate() + 7);

        const invoice = await Invoice.create([{
            inv_id,
            inv_or_id: order._id,
            inv_us_id: order.or_us_id,
            inv_amount: order.or_pd_id.pd_price,
            inv_total: total,
            inv_status: 'pending',
            inv_payment_method,
            inv_date: new Date(),
            inv_due_date: due_date,
            inv_created_at: new Date(),
            inv_updated_at: new Date()
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // Get the created invoice with populated order details
        const populatedInvoice = await Invoice.findById(invoice[0]._id)
            .populate({
                path: 'inv_or_id',
                populate: {
                    path: 'or_pd_id'
                }
            });

        res.status(201).json({
            success: true,
            data: populatedInvoice
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error creating invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while creating invoice'
        });
    }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find()
            .populate({
                path: 'inv_or_id',
                populate: {
                    path: 'or_pd_id'
                }
            })
            .sort({ inv_created_at: -1 });

        res.status(200).json({
            success: true,
            data: invoices
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching invoices'
        });
    }
};

// Get single invoice
exports.getInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ inv_id: req.params.id })
            .populate({
                path: 'inv_or_id',
                populate: {
                    path: 'or_pd_id'
                }
            });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while fetching invoice'
        });
    }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const invoice = await Invoice.findOneAndUpdate(
            { inv_id: req.params.id },
            {
                ...req.body,
                inv_updated_at: new Date()
            },
            {
                new: true,
                runValidators: true,
                session
            }
        ).populate({
            path: 'inv_or_id',
            populate: {
                path: 'or_pd_id'
            }
        });

        if (!invoice) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error updating invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while updating invoice'
        });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const invoice = await Invoice.findOneAndDelete(
            { inv_id: req.params.id },
            { session }
        );

        if (!invoice) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        await session.commitTransaction();
        session.endSession();

        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deleting invoice:', error);
        res.status(500).json({
            success: false,
            error: 'Server error while deleting invoice'
        });
    }
};
