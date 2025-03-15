import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Button,
    Typography,
    Box,
    Alert,
    Snackbar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../utils/api';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsers();
            // Ensure each user has a unique id for DataGrid
            const processedUsers = response.data.data.map(user => ({
                id: user.us_id || `temp-${Math.random()}`, // Fallback ID if us_id is not present
                ...user
            }));
            setUsers(processedUsers);
            setError('');
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        if (id) {
            navigate(`/users/edit/${id}`);
        } else {
            setError('Invalid user ID for editing');
        }
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            await deleteUser(id);
            setSuccessMessage('User deleted successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            setError(error.response?.data?.message || 'Failed to delete user');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        { 
            field: 'us_name', 
            headerName: 'Name', 
            width: 150,
            valueGetter: (params) => params.row.us_name || 'N/A'
        },
        { 
            field: 'us_email', 
            headerName: 'Email', 
            width: 200,
            valueGetter: (params) => params.row.us_email || 'N/A'
        },
        { 
            field: 'us_phone_number', 
            headerName: 'Phone Number', 
            width: 150,
            valueGetter: (params) => params.row.us_phone_number || 'N/A'
        },
        { 
            field: 'us_address', 
            headerName: 'Address', 
            width: 200,
            valueGetter: (params) => params.row.us_address || 'N/A'
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEdit(params.row.us_id)}
                        sx={{ mr: 1 }}
                        disabled={loading}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.us_id)}
                        disabled={loading}
                    >
                        Delete
                    </Button>
                </Box>
            ),
        },
    ];

    return (
        <Container>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4">Users</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/users/new')}
                    disabled={loading}
                >
                    Add User
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 25]}
                    autoHeight
                    loading={loading}
                    disableSelectionOnClick
                    getRowId={(row) => row.id}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            whiteSpace: 'normal',
                            lineHeight: 'normal',
                            padding: '8px'
                        }
                    }}
                />
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

export default UserList;