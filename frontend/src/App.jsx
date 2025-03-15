import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/Products/ProductList';
import CreateProduct from './pages/Products/CreateProduct';
import EditProduct from './pages/Products/EditProduct';
import OrderList from './pages/Orders/OrderList';
import CreateOrder from './pages/Orders/CreateOrder';
import EditOrder from './pages/Orders/EditOrder';
import InvoiceList from './pages/Invoices/InvoiceList';
import CreateInvoice from './pages/Invoices/CreateInvoice';
import EditInvoice from './pages/Invoices/EditInvoice';

// Create theme
const theme = createTheme({
    palette: {
        mode: 'light',
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path="create" element={<CreateProduct />} />
              <Route path=":id/edit" element={<EditProduct />} />
            </Route>
            <Route path="orders">
              <Route index element={<OrderList />} />
              <Route path="create" element={<CreateOrder />} />
              <Route path=":id/edit" element={<EditOrder />} />
            </Route>
            <Route path="invoices">
              <Route index element={<InvoiceList />} />
              <Route path="create" element={<CreateInvoice />} />
              <Route path=":id/edit" element={<EditInvoice />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
