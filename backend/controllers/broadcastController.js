// controllers/broadcastController.js
const Broadcast = require('../models/Broadcast');

// @desc    Create a new broadcast message
// @route   POST /api/broadcasts
// @access  Private/Admin
const createBroadcast = async (req, res) => {
    const { message, targetAudience } = req.body;

    if (!message || !targetAudience) {
        return res.status(400).json({ message: 'Message and target audience are required' });
    }

    try {
        const broadcast = new Broadcast({
            message,
            targetAudience,
            sentBy: req.user._id,
        });

        const createdBroadcast = await broadcast.save();
        res.status(201).json(createdBroadcast);
    } catch (error) {
        res.status(400).json({ message: 'Could not create broadcast', error: error.message });
    }
};

// @desc    Get broadcast messages based on user role
// @route   GET /api/broadcasts
// @access  Private
const getBroadcasts = async (req, res) => {
    try {
        let query = {};

        // Tailor the query based on the logged-in user's role
        if (req.user.role === 'ADMIN') {
            // Admins can see all broadcasts
        } else if (req.user.role === 'VOLUNTEER') {
            query = { targetAudience: { $in: ['ALL_USERS', 'ALL_VOLUNTEERS'] } };
        } else { // Regular 'USER'
            query = { targetAudience: 'ALL_USERS' };
        }

        const broadcasts = await Broadcast.find(query)
            .populate('sentBy', 'name')
            .sort({ createdAt: -1 });
            
        res.json(broadcasts);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createBroadcast, getBroadcasts };