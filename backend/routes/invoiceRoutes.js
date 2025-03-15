const express = require('express');
const router = express.Router();
const {
    createInvoice,
    getAllInvoices,
    getInvoice,
    updateInvoice,
    deleteInvoice
} = require('../controllers/invoiceController');

router.route('/')
    .post(createInvoice)
    .get(getAllInvoices);

router.route('/:id')
    .get(getInvoice)
    .put(updateInvoice)
    .delete(deleteInvoice);

module.exports = router;
