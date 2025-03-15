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
    CircularProgress,
    Card,
    CardContent,
    Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Save as SaveIcon } from '@mui/icons-material';
import { getOrders, createInvoice } from '../../utils/api';

const CreateInvoice = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [formData, setFormData] = useState({
        inv_or_id: '',
        inv_payment_method: 'bank_transfer'
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            setOrders(response.data.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch orders. Please try again later.');
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.inv_or_id) {
            setError('Please select an order');
            return;
        }
        
        setLoading(true);
        try {
            await createInvoice(formData);
            navigate('/invoices');
        } catch (error) {
            setError(error.error || 'Failed to create invoice. Please try again.');
            console.error('Error creating invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderChange = (e) => {
        const orderId = e.target.value;
        setFormData({
            ...formData,
            inv_or_id: orderId
        });
        setSelectedOrder(orders.find(order => order.or_id === orderId));
    };

    const handlePaymentMethodChange = (e) => {
        setFormData({
            ...formData,
            inv_payment_method: e.target.value
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
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
                        <Alert severity="error" onClose={() => setError('')}>
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
                                    onChange={handleOrderChange}
                                    required
                                    disabled={loading}
                                >
                                    {orders.map((order) => (
                                        <MenuItem key={order.or_id} value={order.or_id}>
                                            Order #{order.or_id} - {order.or_pd_id.pd_name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedOrder && (
                                <Card variant="outlined">
                                    <CardContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="h6" gutterBottom>
                                                    Order Details
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Product
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedOrder.or_pd_id.pd_name}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Price
                                                </Typography>
                                                <Typography variant="body1">
                                                    {formatCurrency(selectedOrder.or_pd_id.pd_price)}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Quantity
                                                </Typography>
                                                <Typography variant="body1">
                                                    {selectedOrder.or_amount}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Total Amount
                                                </Typography>
                                                <Typography variant="body1" color="primary.main">
                                                    {formatCurrency(selectedOrder.or_pd_id.pd_price * selectedOrder.or_amount)}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            )}

                            <FormControl fullWidth>
                                <InputLabel>Payment Method</InputLabel>
                                <Select
                                    name="inv_payment_method"
                                    value={formData.inv_payment_method}
                                    onChange={handlePaymentMethodChange}
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
                                disabled={loading || !formData.inv_or_id}
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
