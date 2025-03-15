import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    MenuItem,
    Alert,
    CircularProgress
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrders, createInvoice, getInvoice, updateInvoice } from '../../utils/api';

const InvoiceForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        inv_or_id: '',
        inv_payment_method: 'cash'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch orders first
                const ordersResponse = await getOrders();
                if (!ordersResponse.data.success) {
                    throw new Error('Failed to fetch orders');
                }
                setOrders(ordersResponse.data.data);

                // If editing, fetch invoice details
                if (id && id !== 'new') {
                    const invoiceResponse = await getInvoice(id);
                    if (!invoiceResponse.data.success) {
                        throw new Error('Failed to fetch invoice details');
                    }
                    const invoiceData = invoiceResponse.data.data;
                    setFormData({
                        inv_or_id: invoiceData.inv_or_id.or_id,
                        inv_payment_method: invoiceData.inv_payment_method
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message || 'Failed to load data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate form data
            if (!formData.inv_or_id || !formData.inv_payment_method) {
                throw new Error('Please fill in all required fields');
            }

            const response = id === 'new'
                ? await createInvoice(formData)
                : await updateInvoice(id, formData);

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to save invoice');
            }

            navigate('/invoices');
        } catch (error) {
            console.error('Error saving invoice:', error);
            setError(error.message || 'Failed to save invoice. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/invoices');
    };

    if (loading && !orders.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {id === 'new' ? 'Create Invoice' : 'Edit Invoice'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        label="Order"
                        name="inv_or_id"
                        value={formData.inv_or_id}
                        onChange={(e) => setFormData({ ...formData, inv_or_id: e.target.value })}
                        error={!formData.inv_or_id}
                        helperText={!formData.inv_or_id ? 'Please select an order' : ''}
                        disabled={loading || id !== 'new'}
                    >
                        {orders.map((order) => (
                            <MenuItem key={order.or_id} value={order.or_id}>
                                {`Order ${order.or_id} - ${order.or_pd_id?.pd_name} (${order.or_amount} units) - ${formatCurrency(order.or_amount * (order.or_pd_id?.pd_price || 0))}`}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        label="Payment Method"
                        name="inv_payment_method"
                        value={formData.inv_payment_method}
                        onChange={(e) => setFormData({ ...formData, inv_payment_method: e.target.value })}
                        error={!formData.inv_payment_method}
                        helperText={!formData.inv_payment_method ? 'Please select a payment method' : ''}
                        disabled={loading}
                    >
                        <MenuItem value="cash">Cash</MenuItem>
                        <MenuItem value="credit_card">Credit Card</MenuItem>
                        <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                    </TextField>

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            type="submit" 
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : (id === 'new' ? 'Create' : 'Update')}
                        </Button>
                        <Button 
                            variant="outlined"
                            color="inherit" 
                            fullWidth 
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default InvoiceForm;
