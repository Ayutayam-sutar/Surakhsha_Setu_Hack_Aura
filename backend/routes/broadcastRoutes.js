// routes/broadcastRoutes.js
const express = require('express');
const router = express.Router();
const { createBroadcast, getBroadcasts } = require('../controllers/broadcastController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createBroadcast) // Only admins can create broadcasts
    .get(protect, getBroadcasts);          // All logged-in users can view relevant broadcasts

module.exports = router;