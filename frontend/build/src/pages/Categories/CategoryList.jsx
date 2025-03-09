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
import { getCategories, deleteCategory } from '../../utils/api';

const CategoryList = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            setCategories(response.data.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCategory(id);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const columns = [
        { field: 'ct_id', headerName: 'ID', width: 130 },
        { field: 'ct_code', headerName: 'Code', width: 130 },
        { field: 'ct_name', headerName: 'Name', width: 200 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/categories/${params.row.ct_id}`)}
                        sx={{ mr: 1 }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDelete(params.row.ct_id)}
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
                <Typography variant="h4">Categories</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/categories/new')}
                >
                    Add Category
                </Button>
            </Box>
            <Paper sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={categories}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    getRowId={(row) => row.ct_id}
                    disableSelectionOnClick
                />
            </Paper>
        </Container>
    );
};

export default CategoryList;