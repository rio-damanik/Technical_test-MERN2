import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    IconButton,
    Stack,
    Alert,
    CircularProgress,
    ButtonGroup,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardContent,
    Grid,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Pending as PendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getInvoices, deleteInvoice, updateInvoice } from '../../utils/api';

const InvoiceList = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await getInvoices();
            setInvoices(response.data.data);
            setError('');
        } catch (error) {
            setError('Failed to fetch invoices. Please try again later.');
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedInvoice) return;
        
        try {
            setLoading(true);
            await deleteInvoice(selectedInvoice.inv_id);
            await fetchInvoices();
            setDeleteDialogOpen(false);
            setSelectedInvoice(null);
        } catch (error) {
            setError('Failed to delete invoice. Please try again.');
            console.error('Error deleting invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (invoice, newStatus) => {
        try {
            setLoading(true);
            await updateInvoice(invoice.inv_id, { inv_status: newStatus });
            await fetchInvoices();
        } catch (error) {
            setError('Failed to update invoice status. Please try again.');
            console.error('Error updating invoice status:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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

    const renderStatusButtons = (invoice) => {
        const statuses = ['pending', 'paid', 'cancelled'];
        return (
            <ButtonGroup size="small" variant="outlined">
                {statuses.map((status) => (
                    <Button
                        key={status}
                        onClick={() => handleStatusChange(invoice, status)}
                        variant={invoice.inv_status === status ? "contained" : "outlined"}
                        color={getStatusColor(status)}
                        disabled={loading || invoice.inv_status === status}
                        startIcon={
                            status === 'paid' ? <CheckCircleIcon /> :
                            status === 'pending' ? <PendingIcon /> :
                            <CancelIcon />
                        }
                        sx={{ textTransform: 'capitalize' }}
                    >
                        {status}
                    </Button>
                ))}
            </ButtonGroup>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h4">
                        Invoices
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/invoices/create')}
                    >
                        Create Invoice
                    </Button>
                </Stack>

                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                {loading && !invoices.length && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                    </Box>
                )}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Invoice ID</TableCell>
                                <TableCell>Product</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.map((invoice) => (
                                <TableRow key={invoice.inv_id}>
                                    <TableCell>{invoice.inv_id}</TableCell>
                                    <TableCell>
                                        {invoice.inv_or_id?.or_pd_id?.pd_name || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(invoice.inv_amount)}
                                    </TableCell>
                                    <TableCell>
                                        {formatCurrency(invoice.inv_total)}
                                    </TableCell>
                                    <TableCell>
                                        {renderStatusButtons(invoice)}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={invoice.inv_payment_method.replace('_', ' ').toUpperCase()}
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(invoice.inv_due_date)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            <Tooltip title="Edit Invoice">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`/invoices/${invoice.inv_id}/edit`)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete Invoice">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setSelectedInvoice(invoice);
                                                        setDeleteDialogOpen(true);
                                                    }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                >
                    <DialogTitle>Delete Invoice</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete invoice {selectedInvoice?.inv_id}?
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => setDeleteDialogOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="error"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </Box>
    );
};

export default InvoiceList;
