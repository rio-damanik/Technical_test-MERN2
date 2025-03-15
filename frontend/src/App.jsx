import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import OrderList from './pages/Orders/OrderList';
import OrderForm from './pages/Orders/OrderForm';
import InvoiceList from './pages/Invoices/InvoiceList';
import InvoiceForm from './pages/Invoices/InvoiceForm';

// Create theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2'
        },
        secondary: {
            main: '#dc004e'
        }
    },
    typography: {
        fontFamily: [
            'Roboto',
            'Arial',
            'sans-serif'
        ].join(',')
    }
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    {/* Orders */}
                    <Route path="/orders" element={<OrderList />} />
                    <Route path="/orders/new" element={<OrderForm />} />
                    <Route path="/orders/:id" element={<OrderForm />} />

                    {/* Invoices */}
                    <Route path="/invoices" element={<InvoiceList />} />
                    <Route path="/invoices/new" element={<InvoiceForm />} />
                    <Route path="/invoices/:id" element={<InvoiceForm />} />

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/orders" replace />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

export default App;
