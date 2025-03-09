import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        us_name: '',
        us_email: '',
        us_password: '',
        us_phone_number: '',
        us_address: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await register(formData);
            localStorage.setItem('token', response.data.token);
            navigate('/users');
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            setError('Registration failed. Please check your details.'); // Set error message
        }
    };
    
    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Register
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Name"
                        name="us_name"
                        autoComplete="name"
                        autoFocus
                        value={formData.us_name}
                        onChange={(e) => setFormData({ ...formData, us_name: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="us_email"
                        autoComplete="email"
                        value={formData.us_email}
                        onChange={(e) => setFormData({ ...formData, us_email: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="us_password"
                        label="Password"
                        type="password"
                        autoComplete="new-password"
                        value={formData.us_password}
                        onChange={(e) => setFormData({ ...formData, us_password: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Phone Number"
                        name="us_phone_number"
                        value={formData.us_phone_number}
                        onChange={(e) => setFormData({ ...formData, us_phone_number: e.target.value })}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Address"
                        name="us_address"
                        value={formData.us_address}
                        onChange={(e) => setFormData({ ...formData, us_address: e.target.value })}
                    />
                    {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Register;