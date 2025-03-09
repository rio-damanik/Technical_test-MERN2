import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    MenuItem
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getOrder, createOrder, updateOrder, getProducts } from '../../utils/api';

const OrderForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        or_pd_id: '',
        or_amount: ''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchOrder = async () => {
            if (id && id !== 'new') {
                try {
                    const response = await getOrder(id);
                    setFormData(response.data.data);
                } catch (error) {
                    console.error('Error fetching order:', error);
                }
            }
        };

        fetchProducts();
        fetchOrder();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id === 'new') {
                await createOrder(formData);
            } else {
                await updateOrder(id, formData);
            }
            navigate('/orders');
        } catch (error) {
            console.error('Error saving order:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {id === 'new' ? 'Create Order' : 'Edit Order'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        label="Product"
                        value={formData.or_pd_id}
                        onChange={(e) => setFormData({ ...formData, or_pd_id: e.target.value })}
                    >
                        {products.map((product) => (
                            <MenuItem key={product.pd_id} value={product.pd_id}>
                                {product.pd_name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Amount"
                        type="number"
                        value={formData.or_amount}
                        onChange={(e) => setFormData({ ...formData, or_amount: e.target.value })}
                    />
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Save
                        </Button>
                        <Button variant="contained" color="inherit" fullWidth onClick={() => navigate('/orders')}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default OrderForm;