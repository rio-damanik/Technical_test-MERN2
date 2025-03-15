import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import { Receipt as InvoiceIcon, ShoppingCart as OrderIcon, Inventory as ProductIcon } from '@mui/icons-material';

const Dashboard = () => {
    return (
        <Box sx={{ p: 3 }}>
            <Stack spacing={3}>
                <Typography variant="h4">
                    Dashboard
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2} alignItems="center">
                                    <InvoiceIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                                    <Typography variant="h6">
                                        Invoices
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2} alignItems="center">
                                    <OrderIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                                    <Typography variant="h6">
                                        Orders
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2} alignItems="center">
                                    <ProductIcon sx={{ fontSize: 48, color: 'primary.main' }} />
                                    <Typography variant="h6">
                                        Products
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Stack>
        </Box>
    );
};

export default Dashboard;
