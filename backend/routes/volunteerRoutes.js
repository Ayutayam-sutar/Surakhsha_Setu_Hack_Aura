// routes/volunteerRoutes.js
const express = require('express');
const router = express.Router();
const {
    getMyAssignedIncidents,
    updateMyAvailability,
    getAvailableVolunteers,
} = require('../controllers/volunteerController');
const { protect, admin, volunteer } = require('../middleware/authMiddleware');

// --- Volunteer-only Routes ---
router.get('/my-incidents', protect, volunteer, getMyAssignedIncidents);
router.put('/availability', protect, volunteer, updateMyAvailability);

// --- Admin-only Route ---
router.get('/available', protect, admin, getAvailableVolunteers);

module.exports = router;