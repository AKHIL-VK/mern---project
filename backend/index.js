require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection bypassed because we are using in-memory arrays!
// connectDB();

// Routes
const authRoutes = require('./routes/authRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');

app.get('/', (req, res) => {
    res.send('Student Grievance API is running...');
});

app.use('/api', authRoutes);
app.use('/api/grievances', grievanceRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
