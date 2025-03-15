import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Add a request interceptor
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

// Add a response interceptor
API.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const customError = {
        success: false,
        error: error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred'
    };
    return Promise.reject(customError);
});

// Users
export const getUsers = () => API.get('/users');
export const getUser = (id) => API.get(`/users/${id}`);
export const updateUser = (id, formData) => API.put(`/users/${id}`, formData);
export const deleteUser = (id) => API.delete(`/users/${id}`);

// Orders
export const getOrders = () => API.get('/orders');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const createOrder = (formData) => API.post('/orders', formData);
export const updateOrder = (id, formData) => API.put(`/orders/${id}`, formData);
export const deleteOrder = (id) => API.delete(`/orders/${id}`);

// Products
export const getProducts = () => API.get('/products');
export const getProduct = (id) => API.get(`/products/${id}`);
export const createProduct = (formData) => API.post('/products', formData);
export const updateProduct = (id, formData) => API.put(`/products/${id}`, formData);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

// Categories
export const getCategories = () => API.get('/categories');
export const getCategory = (id) => API.get(`/categories/${id}`);
export const createCategory = (formData) => API.post('/categories', formData);
export const updateCategory = (id, formData) => API.put(`/categories/${id}`, formData);
export const deleteCategory = (id) => API.delete(`/categories/${id}`);

// Invoices
export const getInvoices = () => API.get('/invoices');
export const getInvoice = (id) => API.get(`/invoices/${id}`);
export const createInvoice = (formData) => API.post('/invoices', formData);
export const updateInvoice = (id, formData) => API.put(`/invoices/${id}`, formData);
export const deleteInvoice = (id) => API.delete(`/invoices/${id}`);

export const register = (formData) => API.post('/users/register', formData);
export const login = (formData) => API.post('/users/login', formData);