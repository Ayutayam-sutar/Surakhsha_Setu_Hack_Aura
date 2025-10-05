// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
    // ... (existing protect function is unchanged)
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// NEW: Middleware to check for Admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next(); // User is an admin, proceed to the next function
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
    }
};

const volunteer = (req, res, next) => {
    if (req.user && req.user.role === 'VOLUNTEER') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as a volunteer' });
    }
};

module.exports = { protect, admin, volunteer };