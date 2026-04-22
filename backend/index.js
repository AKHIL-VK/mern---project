require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
const productRoutes = require('./routes/productRoutes');
const studentRoutes = require('./routes/mse 2');

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api', studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
