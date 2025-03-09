import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategory, createCategory, updateCategory } from '../../utils/api';

const CategoryForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        ct_code: '',
        ct_name: ''
    });

    useEffect(() => {
        const fetchCategory = async () => {
            if (id && id !== 'new') {
                try {
                    const response = await getCategory(id);
                    setFormData(response.data.data);
                } catch (error) {
                    console.error('Error fetching category:', error);
                }
            }
        };
        fetchCategory();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id === 'new') {
                await createCategory(formData);
            } else {
                await updateCategory(id, formData);
            }
            navigate('/categories');
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    {id === 'new' ? 'Create Category' : 'Edit Category'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Code"
                        value={formData.ct_code}
                        onChange={(e) => setFormData({ ...formData, ct_code: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        value={formData.ct_name}
                        onChange={(e) => setFormData({ ...formData, ct_name: e.target.value })}
                    />
                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Save
                        </Button>
                        <Button variant="contained" color="inherit" fullWidth onClick={() => navigate('/categories')}>
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CategoryForm;