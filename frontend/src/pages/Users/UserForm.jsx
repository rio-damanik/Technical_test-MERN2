import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { getUser, updateUser, register } from '../../utils/api';

const UserForm = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Ambil ID user dari URL
    const isEditMode = id && id !== 'new'; // Cek apakah sedang edit atau create
    const [formData, setFormData] = useState({
        us_name: '',
        us_email: '',
        us_password: '',
        us_phone_number: '',
        us_address: '',
    });
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState('');

    // Fetch user data saat mode edit
    useEffect(() => {
        const fetchUser = async () => {
            if (isEditMode) {
                setLoading(true);
                try {
                    const response = await getUser(id);
                    const userData = response.data.data;
                    setFormData({
                        us_name: userData.us_name,
                        us_email: userData.us_email,
                        us_phone_number: userData.us_phone_number,
                        us_address: userData.us_address,
                        us_password: '', // Kosongkan password untuk keamanan
                    });
                } catch (error) {
                    console.error('Error fetching user:', error);
                    setError('Gagal mengambil data user. Silakan coba lagi.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUser();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        if (!formData.us_name || !formData.us_email) {
            setError('Nama dan email wajib diisi.');
            return false;
        }
        if (!isEditMode && !formData.us_password) {
            setError('Password wajib diisi untuk user baru.');
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
                await updateUser(id, formData);
            } else {
                await register(formData);
            }
            navigate('/users'); // Kembali ke daftar user
        } catch (error) {
            console.error('Error saving user:', error);
            if (error.response?.data?.error) {
                setError(`Error: ${error.response.data.error}`);
            } else {
                setError('Gagal menyimpan data. Silakan coba lagi.');
            }
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
        />
    );

    if (loading) {
        return (
            <Container component="main" maxWidth="xs">
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    {isEditMode ? 'Edit User' : 'Create New User'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {renderTextField('Name', 'us_name', 'text', true)}
                    {renderTextField('Email', 'us_email', 'email', true)}
                    {!isEditMode && renderTextField('Password', 'us_password', 'password', true)}
                    {renderTextField('Phone Number', 'us_phone_number')}
                    {renderTextField('Address', 'us_address')}
                    {error && <Typography color="error">{error}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update User' : 'Create User'}
                    </Button>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate('/users')}
                        sx={{ mt: 1 }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default UserForm;
