import axios from 'axios';

// Create an Axios instance configured to point to your backend server
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // This points to your Express backend
});

// Example function to fetch all products
export const fetchProducts = () => API.get('/products');

// Example function to add a new product
export const createProduct = (newProduct) => API.post('/products', newProduct);

export default API;
