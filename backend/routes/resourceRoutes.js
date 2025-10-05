// routes/resourceRoutes.js
const express = require('express');
const router = express.Router();
const {
    createResource,
    getResources,
    updateResource,
} = require('../controllers/resourceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, admin, createResource) // Admins create resources
    .get(protect, getResources);          // All logged-in users can view resources

router.route('/:id')
    .put(protect, admin, updateResource); // Admins update resources

module.exports = router;