// routes/incidentRoutes.js
const express = require('express');
const router = express.Router();
const {
    createIncident,
    getIncidents,
    updateIncidentStatus,
    assignVolunteerToIncident,
} = require('../controllers/incidentController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes for all logged-in users
router.route('/')
  
    .post(protect, upload, createIncident) 
    .get(protect, getIncidents);

// Admin-only routes
router.put('/:id/status', protect, admin, updateIncidentStatus);
router.put('/:id/assign', protect, assignVolunteerToIncident);

module.exports = router;