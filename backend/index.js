// index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const volunteerRoutes = require('./routes/volunteerRoutes');
const broadcastRoutes = require('./routes/broadcastRoutes'); 
const safetyCheckRoutes = require('./routes/safetyCheckRoutes');
const path = require('path'); 

// Load environment variables
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api/users', userRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/broadcasts', broadcastRoutes);
app.use('/api/safety', safetyCheckRoutes); 
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// A simple test route
app.get('/', (req, res) => {
    res.send('SafeHaven API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});