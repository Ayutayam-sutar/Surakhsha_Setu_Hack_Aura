// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// FIX: Added 'updateUserProfile' to the import list
const { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    getAllUsers, 
    updateUserStatus,
    updateUserProfile // <-- This was missing
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware'); 

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route for logged-in users to get and update their own profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// --- Admin-Only Routes ---
router.route('/').get(protect, admin, getAllUsers);
router.route('/:id/status').put(protect, admin, updateUserStatus);

module.exports = router;