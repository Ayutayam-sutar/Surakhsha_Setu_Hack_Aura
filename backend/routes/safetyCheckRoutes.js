// routes/safetyCheckRoutes.js
const express = require('express');
const router = express.Router();
const { createSafetyCheck } = require('../controllers/safetyCheckController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSafetyCheck);

module.exports = router;