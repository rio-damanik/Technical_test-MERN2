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
import { getOrders, deleteOrder } from '../../utils/api';

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getOrders();
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteOrder(id);
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const columns = [
        { field: 'or_id', headerName: 'ID', width: 130 },
        { field: 'or_pd_id', headerName: 'Product ID', width: 130 },
        { field: 'or_amount', headerName: 'Amount', width: 130 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/orders/${params.row.or_id}`)}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.or_id)}
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
                <Typography variant="h4">Orders</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/orders/new')}
                >
                    Add Order
                </Button>
            </Box>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    getRowId={(row) => row.or_id}
                    disableSelectionOnClick
                />
            </Paper>
        </Container>
    );
};

export default OrderList;