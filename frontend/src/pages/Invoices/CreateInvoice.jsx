import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Paper,
    Stack,
    Alert,
    CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Save as SaveIcon } from '@mui/icons-material';
import { getOrders, createInvoice } from '../../utils/api';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        inv_or_id: '',
        inv_payment_method: 'bank_transfer'
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            // Filter out orders that already have invoices
            const ordersWithoutInvoices = response.data.data;
            setOrders(ordersWithoutInvoices);
            setError('');
        } catch (error) {
            setError('Failed to fetch orders. Please try again later.');
            console.error('Error fetching orders:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createInvoice(formData);
            navigate('/invoices');
        } catch (error) {
            setError('Failed to create invoice. Please try again.');
            console.error('Error creating invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const paymentMethods = [
        { value: 'bank_transfer', label: 'Bank Transfer' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'cash', label: 'Cash' }
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Stack spacing={3}>
                    <Typography variant="h4">
                        Create Invoice
                    </Typography>

                    {error && (
                        <Alert severity="error">
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <FormControl fullWidth>
                                <InputLabel>Order</InputLabel>
                                <Select
                                    name="inv_or_id"
                                    value={formData.inv_or_id}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    {orders.map((order) => (
                                        <MenuItem key={order.or_id} value={order.or_id}>
                                            Order #{order.or_id} - Amount: {order.or_amount}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    name="inv_payment_method"
                                    value={formData.inv_payment_method}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                >
                                    {paymentMethods.map((method) => (
                                        <MenuItem key={method.value} value={method.value}>
                                            {method.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            >
                                {loading ? 'Creating...' : 'Create Invoice'}
                            </Button>
                        </Stack>
                    </form>
                </Stack>
            </Paper>
        </Box>
    );
};

export default CreateInvoice;
