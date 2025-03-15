import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import UserList from './pages/Users/UserList';
import UserForm from './pages/Users/UserForm';
import ProductList from './pages/Products/ProductList';
import ProductForm from './pages/Products/ProductForm';
import CategoryList from './pages/Categories/CategoryList';
import CategoryForm from './pages/Categories/CategoryForm';
import OrderList from './pages/Orders/OrderList';
import OrderForm from './pages/Orders/OrderForm';
import InvoiceList from './pages/Invoices/InvoiceList';
import CreateInvoice from './pages/Invoices/CreateInvoice';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<PrivateRoute><UserList /></PrivateRoute>} />
        <Route path="/users/add" element={<PrivateRoute><UserForm /></PrivateRoute>} />
        <Route path="/users/new" element={<PrivateRoute><UserForm /></PrivateRoute>} />
        <Route path="/users/edit/:id" element={<PrivateRoute><UserForm /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
        <Route path="/products/:id" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        <Route path="/categories" element={<PrivateRoute><CategoryList /></PrivateRoute>} />
        <Route path="/categories/:id" element={<PrivateRoute><CategoryForm /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrderList /></PrivateRoute>} />
        <Route path="/orders/:id" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
        <Route path="/invoices" element={<PrivateRoute><InvoiceList /></PrivateRoute>} />
        <Route path="/invoices/new" element={<PrivateRoute><CreateInvoice /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;