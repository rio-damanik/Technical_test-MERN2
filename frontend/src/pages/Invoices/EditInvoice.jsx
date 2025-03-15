import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    Alert,
    Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getInvoice, updateInvoice } from '../../utils/api';

const EditInvoice = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        inv_status: '',
        inv_payment_method: ''
    });

    useEffect(() => {
        fetchInvoice();
    }, [id]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const response = await getInvoice(id);
            const invoiceData = response.data.data;
            setInvoice(invoiceData);
            setFormData({
                inv_status: invoiceData.inv_status,
                inv_payment_method: invoiceData.inv_payment_method
            });
        } catch (error) {
            setError('Failed to fetch invoice details. Please try again.');
            console.error('Error fetching invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            await updateInvoice(id, formData);
            setSuccess('Invoice updated successfully!');
            setTimeout(() => {
                navigate('/invoices');
            }, 1500);
        } catch (error) {
            setError('Failed to update invoice. Please try again.');
            console.error('Error updating invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading && !invoice) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Typography variant="h4">
                    Edit Invoice
                </Typography>

                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success">
                        {success}
                    </Alert>
                )}

                {invoice && (
                    <>
                        <Card>
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Invoice ID
                                        </Typography>
                                        <Typography variant="body1">
                                            {invoice.inv_id}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Product
                                        </Typography>
                                        <Typography variant="body1">
                                            {invoice.inv_or_id?.or_pd_id?.pd_name || 'N/A'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Amount
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatCurrency(invoice.inv_amount)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Total
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatCurrency(invoice.inv_total)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Due Date
                                        </Typography>
                                        <Typography variant="body1">
                                            {formatDate(invoice.inv_due_date)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            name="inv_status"
                                            value={formData.inv_status}
                                            onChange={handleChange}
                                            label="Status"
                                            required
                                        >
                                            <MenuItem value="pending">Pending</MenuItem>
                                            <MenuItem value="paid">Paid</MenuItem>
                                            <MenuItem value="cancelled">Cancelled</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Payment Method</InputLabel>
                                        <Select
                                            name="inv_payment_method"
                                            value={formData.inv_payment_method}
                                            onChange={handleChange}
                                            label="Payment Method"
                                            required
                                        >
                                            <MenuItem value="credit_card">Credit Card</MenuItem>
                                            <MenuItem value="debit_card">Debit Card</MenuItem>
                                            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                                            <MenuItem value="cash">Cash</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row" spacing={2} justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            onClick={() => navigate('/invoices')}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={loading}
                                            startIcon={loading && <CircularProgress size={20} />}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </>
                )}
            </Stack>
        </Box>
    );
};

export default EditInvoice;
