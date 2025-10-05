// controllers/safetyCheckController.js
const SafetyCheck = require('../models/SafetyCheck');
const User = require('../models/User');

const createSafetyCheck = async (req, res) => {
    const { status, location, message } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        // 1. Create a historical log of the check-in
        const safetyCheck = await SafetyCheck.create({
            user: user._id,
            status,
            location,
            message,
        });

        // 2. Update the user's current status on their main profile
        user.safetyStatus = {
            status: status,
            timestamp: new Date(),
        };
        await user.save();

        res.status(201).json(safetyCheck);
    } catch (error) {
        console.error('SAFETY CHECK ERROR:', error);
        res.status(400).json({ message: 'Could not submit safety check' });
    }
};

module.exports = { createSafetyCheck };