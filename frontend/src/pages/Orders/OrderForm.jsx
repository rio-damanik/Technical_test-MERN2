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
import { getOrder, createOrder, updateOrder, getProducts } from '../../utils/api';

const OrderForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        or_pd_id: '',
        or_amount: '',
        or_us_id: 'USR1742026407480' // Default user ID from seeder
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');

                // Fetch products first
                const productsResponse = await getProducts();
                if (!productsResponse.data.success) {
                    throw new Error('Failed to fetch products');
                }
                setProducts(productsResponse.data.data);

                // If editing, fetch order details
                if (id && id !== 'new') {
                    const orderResponse = await getOrder(id);
                    if (!orderResponse.data.success) {
                        throw new Error('Failed to fetch order details');
                    }
                    const orderData = orderResponse.data.data;
                    setFormData({
                        or_pd_id: orderData.or_pd_id._id,
                        or_amount: orderData.or_amount.toString(),
                        or_us_id: orderData.or_us_id
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
            if (!formData.or_pd_id || !formData.or_amount || !formData.or_us_id) {
                throw new Error('Please fill in all required fields');
            }

            const amount = parseInt(formData.or_amount, 10);
            if (isNaN(amount) || amount < 1) {
                throw new Error('Please enter a valid quantity (minimum 1)');
            }

            const orderData = {
                ...formData,
                or_amount: amount
            };

            const response = id === 'new' 
                ? await createOrder(orderData)
                : await updateOrder(id, orderData);

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to save order');
            }

            navigate('/orders');
        } catch (error) {
            console.error('Error saving order:', error);
            setError(error.message || 'Failed to save order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/orders');
    };

    if (loading && !products.length) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {id === 'new' ? 'Create Order' : 'Edit Order'}
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
                        label="Product"
                        name="or_pd_id"
                        value={formData.or_pd_id}
                        onChange={(e) => setFormData({ ...formData, or_pd_id: e.target.value })}
                        error={!formData.or_pd_id}
                        helperText={!formData.or_pd_id ? 'Please select a product' : ''}
                        disabled={loading}
                    >
                        {products.map((product) => (
                            <MenuItem key={product._id} value={product._id}>
                                {`${product.pd_name} - ${new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR'
                                }).format(product.pd_price)}`}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Quantity"
                        name="or_amount"
                        type="number"
                        inputProps={{ min: 1 }}
                        value={formData.or_amount}
                        onChange={(e) => setFormData({ ...formData, or_amount: e.target.value })}
                        error={!formData.or_amount || parseInt(formData.or_amount, 10) < 1}
                        helperText={
                            !formData.or_amount ? 'Please enter quantity' :
                            parseInt(formData.or_amount, 10) < 1 ? 'Minimum quantity is 1' : ''
                        }
                        disabled={loading}
                    />

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

export default OrderForm;