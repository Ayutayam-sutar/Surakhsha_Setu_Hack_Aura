// controllers/volunteerController.js
const User = require('../models/User');
const Incident = require('../models/Incident');

// @desc    Get incidents assigned to the logged-in volunteer
// @route   GET /api/volunteers/my-incidents
// @access  Private/Volunteer
const getMyAssignedIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find({ assignedTo: req.user._id })
            .populate('reportedBy', 'name email')
            .sort({ createdAt: -1 });
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update the logged-in volunteer's availability
// @route   PUT /api/volunteers/availability
// @access  Private/Volunteer
const updateMyAvailability = async (req, res) => {
    try {
        const volunteer = await User.findById(req.user._id);

        if (volunteer) {
            volunteer.isAvailable = req.body.isAvailable; // Expecting { "isAvailable": true } or false
            const updatedVolunteer = await volunteer.save();
            res.json({
                _id: updatedVolunteer._id,
                name: updatedVolunteer.name,
                isAvailable: updatedVolunteer.isAvailable,
            });
        } else {
            res.status(404).json({ message: 'Volunteer not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all available volunteers
// @route   GET /api/volunteers/available
// @access  Private/Admin
const getAvailableVolunteers = async (req, res) => {
    try {
        const volunteers = await User.find({ role: 'VOLUNTEER', isAvailable: true }).select(
            'name email skills'
        );
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMyAssignedIncidents,
    updateMyAvailability,
    getAvailableVolunteers,
};