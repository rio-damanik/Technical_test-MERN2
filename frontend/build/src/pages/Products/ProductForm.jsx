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
import { getProduct, createProduct, updateProduct, getCategories } from '../../utils/api';

const ProductForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        pd_code: '',
        pd_name: '',
        pd_price: '',
        pd_ct_id: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategories();
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchProduct = async () => {
            if (id && id !== 'new') {
                try {
                    const response = await getProduct(id);
                    setFormData(response.data.data);
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            }
        };

        fetchCategories();
        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id === 'new') {
                await createProduct(formData);
            } else {
                await updateProduct(id, formData);
            }
            navigate('/products');
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {id === 'new' ? 'Create Product' : 'Edit Product'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Code"
                        value={formData.pd_code}
                        onChange={(e) => setFormData({ ...formData, pd_code: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        value={formData.pd_name}
                        onChange={(e) => setFormData({ ...formData, pd_name: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Price"
                        type="number"
                        value={formData.pd_price}
                        onChange={(e) => setFormData({ ...formData, pd_price: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        select
                        label="Category"
                        value={formData.pd_ct_id}
                        onChange={(e) => setFormData({ ...formData, pd_ct_id: e.target.value })}
                    >
                        {categories.map((category) => (
                            <MenuItem key={category.ct_id} value={category.ct_id}>
                                {category.ct_name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Save
                        </Button>
                        <Button variant="contained" color="inherit" fullWidth onClick={() => navigate('/products')}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default ProductForm;