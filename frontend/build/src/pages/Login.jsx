import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        us_email: '',
        us_password: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Login data:', formData); // Log form data
        try {
            const response = await login(formData);
            localStorage.setItem('token', response.data.token);
            navigate('/users');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid email or password'); // Set error message
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Email"
                        name="us_email"
                        autoComplete="email"
                        autoFocus
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
                        autoComplete="current-password"
                        value={formData.us_password}
                        onChange={(e) => setFormData({ ...formData, us_password: e.target.value })}
                    />
                    {error && <Typography color="error">{error}</Typography>} {/* Display error message */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                    >
                        Sign In
                    </Button>
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Don't have an account? <Link href="/register">Register</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;