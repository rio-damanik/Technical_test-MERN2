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
import { getInvoices, deleteInvoice } from '../../utils/api';
import { ReceiptLong as InvoiceIcon } from '@mui/icons-material';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getInvoices();
            if (!response.data.success) {
                throw new Error('Failed to fetch invoices');
            }
            const processedInvoices = response.data.data.map(invoice => ({
                id: invoice.inv_id,
                ...invoice,
                order_id: invoice.inv_or_id?.or_id || 'Unknown',
                product_name: invoice.inv_or_id?.or_pd_id?.pd_name || 'Unknown Product',
                quantity: invoice.inv_or_id?.or_amount || 0
            }));
            setInvoices(processedInvoices);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            setError(error.message || 'Failed to fetch invoices');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this invoice?')) {
            return;
        }
        try {
            setError('');
            const response = await deleteInvoice(id);
            if (!response.data.success) {
                throw new Error('Failed to delete invoice');
            }
            fetchInvoices();
        } catch (error) {
            console.error('Error deleting invoice:', error);
            setError(error.message || 'Failed to delete invoice');
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            field: 'inv_id',
            headerName: 'Invoice ID',
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
            field: 'order_id',
            headerName: 'Order ID',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    variant="outlined"
                    size="small"
                />
            )
        },
        {
            field: 'product_name',
            headerName: 'Product',
            width: 200
        },
        {
            field: 'quantity',
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
            field: 'inv_amount',
            headerName: 'Unit Price',
            width: 150,
            valueFormatter: (params) => formatCurrency(params.value)
        },
        {
            field: 'inv_total',
            headerName: 'Total Amount',
            width: 150,
            valueFormatter: (params) => formatCurrency(params.value)
        },
        {
            field: 'inv_status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    color={getStatusColor(params.value)}
                    size="small"
                />
            )
        },
        {
            field: 'inv_payment_method',
            headerName: 'Payment Method',
            width: 150,
            valueFormatter: (params) => params.value.replace('_', ' ').toUpperCase()
        },
        {
            field: 'inv_date',
            headerName: 'Invoice Date',
            width: 180,
            valueFormatter: (params) => formatDate(params.value)
        },
        {
            field: 'inv_due_date',
            headerName: 'Due Date',
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
                        onClick={() => navigate(`/invoices/${params.row.inv_id}`)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.inv_id)}
                    >
                        Delete
                    </Button>
                </Box>
            )
        }
    ];

    if (loading && !invoices.length) {
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
                    <InvoiceIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4">Invoices</Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/invoices/new')}
                >
                    Create Invoice
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={invoices}
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

export default InvoiceList;
