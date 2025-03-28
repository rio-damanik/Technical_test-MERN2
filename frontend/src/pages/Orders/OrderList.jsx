import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Button,
    Typography,
    Box,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getOrders, deleteOrder } from '../../utils/api';
import { ShoppingCart as CartIcon } from '@mui/icons-material';

const OrderList = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOrders();
            if (response.data.success) {
                const processedOrders = response.data.data.map(order => ({
                    id: order.or_id,
                    ...order,
                    product_name: order.or_pd_id?.pd_name || 'Unknown Product',
                    product_price: order.or_pd_id?.pd_price || 0,
                    total_amount: order.total_amount || (order.or_amount * (order.or_pd_id?.pd_price || 0))
                }));
                setOrders(processedOrders);
            } else {
                setError('Failed to load orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order? This will also delete any associated invoices.')) {
            return;
        }
        try {
            setError(null);
            const response = await deleteOrder(id);
            if (response.data.success) {
                fetchOrders();
            } else {
                setError('Failed to delete order');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Failed to delete order');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    };

    const columns = [
        { 
            field: 'or_id', 
            headerName: 'Order ID', 
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
            )
        },
        { 
            field: 'product_name', 
            headerName: 'Product', 
            width: 200,
            valueGetter: (params) => params.row.or_pd_id?.pd_name || 'Unknown Product'
        },
        { 
            field: 'or_amount', 
            headerName: 'Quantity', 
            width: 100,
            align: 'center',
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color="secondary"
                    size="small"
                />
            )
        },
        {
            field: 'product_price',
            headerName: 'Unit Price',
            width: 150,
            valueGetter: (params) => params.row.or_pd_id?.pd_price || 0,
            valueFormatter: (params) => formatCurrency(params.value)
        },
        {
            field: 'total_amount',
            headerName: 'Total Amount',
            width: 150,
            valueFormatter: (params) => formatCurrency(params.value)
        },
        {
            field: 'or_created_at',
            headerName: 'Order Date',
            width: 180,
            valueFormatter: (params) => formatDate(params.value)
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/orders/${params.row.or_id}`)}
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CartIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4">Orders</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/orders/new')}
                >
                    Add Order
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={orders}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    loading={loading}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: '0.875rem'
                        }
                    }}
                />
            </Paper>
        </Container>
    );
};

export default OrderList;