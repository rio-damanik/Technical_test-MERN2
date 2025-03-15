import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser, register } from '../../utils/api';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = id && id !== 'new';
    const [formData, setFormData] = useState({
        us_name: '',
        us_email: '',
        us_password: '',
        us_phone_number: '',
        us_address: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            if (isEditMode) {
                setLoading(true);
                try {
                    const response = await getUser(id);
                    const userData = response.data.data;
                    setFormData({
                        us_name: userData.us_name || '',
                        us_email: userData.us_email || '',
                        us_phone_number: userData.us_phone_number || '',
                        us_address: userData.us_address || '',
                        us_password: '', // Don't show password
                    });
                    setError('');
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setError(error.response?.data?.message || 'Failed to fetch user data');
                    if (error.response?.status === 404) {
                        navigate('/users');
                    }
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [id, isEditMode, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.us_name.trim()) {
            setError('Name is required');
            return false;
        }
        if (!formData.us_email.trim()) {
            setError('Email is required');
            return false;
        }
        if (!isEditMode && !formData.us_password.trim()) {
            setError('Password is required for new users');
            return false;
        }
        if (formData.us_email.trim() && !formData.us_email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            if (isEditMode) {
                const updateData = { ...formData };
                if (!updateData.us_password) {
                    delete updateData.us_password;
                }
                await updateUser(id, updateData);
                setSuccessMessage('User updated successfully');
            } else {
                await register(formData);
                setSuccessMessage('User created successfully');
            }
            setTimeout(() => navigate('/users'), 1500);
        } catch (error) {
            console.error('Error saving user:', error);
            setError(
                error.response?.data?.message || 
                error.response?.data?.error || 
                'Failed to save user. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const renderTextField = (label, name, type = 'text', required = false) => (
        <TextField
            margin="normal"
            required={required}
            fullWidth
            label={label}
            name={name}
            type={type}
            value={formData[name]}
            onChange={handleChange}
            error={!!error && required && !formData[name]}
            helperText={error && required && !formData[name] ? `${label} is required` : ''}
            disabled={loading}
            autoComplete={type === 'password' ? 'new-password' : 'off'}
        />
    );

    if (loading && isEditMode) {
        return (
            <Container component="main" maxWidth="xs">
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center', 
                    minHeight: '50vh' 
                }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading user data...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center" gutterBottom>
                    {isEditMode ? 'Edit User' : 'Create New User'}
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {renderTextField('Name', 'us_name', 'text', true)}
                    {renderTextField('Email', 'us_email', 'email', true)}
                    {(!isEditMode || formData.us_password) && 
                        renderTextField(
                            isEditMode ? 'New Password (leave blank to keep current)' : 'Password',
                            'us_password',
                            'password',
                            !isEditMode
                        )
                    }
                    {renderTextField('Phone Number', 'us_phone_number')}
                    {renderTextField('Address', 'us_address')}

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 1 }}
                        disabled={loading}
                    >
                        {loading ? (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress size={20} sx={{ mr: 1 }} />
                                {isEditMode ? 'Updating...' : 'Creating...'}
                            </Box>
                        ) : (
                            isEditMode ? 'Update User' : 'Create User'
                        )}
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate('/users')}
                        sx={{ mt: 1 }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={!!successMessage}
                autoHideDuration={3000}
                onClose={() => setSuccessMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSuccessMessage('')} 
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default UserForm;
