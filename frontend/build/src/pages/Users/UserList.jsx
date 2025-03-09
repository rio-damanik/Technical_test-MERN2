import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Button,
    Typography,
    Box
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getUsers, deleteUser } from '../../utils/api';

const UserList = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await getUsers();
            console.log('Fetched users:', response.data.data);
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleEdit = (id) => {
        console.log('Editing user with ID:', id);
        if (id) {
            navigate(`/users/edit/${id}`);
        } else {
            console.error('No ID provided for editing');
        }
    };

    const handleDelete = async (id) => {
        console.log('Deleting user with ID:', id);
        try {
            const response = await deleteUser(id);
            console.log('Delete response:', response.data);
            fetchUsers(); // Refresh the user list after deletion
        } catch (error) {
            console.error('Error deleting user:', error.response || error.message);
            alert('Failed to delete user.');
        }
    };

    const columns = [
        { field: '_id', headerName: 'ID', width: 130 },
        { field: 'us_name', headerName: 'Name', width: 130 },
        { field: 'us_email', headerName: 'Email', width: 200 },
        { field: 'us_phone_number', headerName: 'Phone Number', width: 150 },
        { field: 'us_address', headerName: 'Address', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleEdit(params.row._id)}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row._id)}
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
                >
                    Add User
                </Button>
            </Box>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={users}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    getRowId={(row) => row._id}
                    disableSelectionOnClick
                />
            </Paper>
        </Container>
    );
};

export default UserList;