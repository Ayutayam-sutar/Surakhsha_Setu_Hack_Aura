const Incident = require('../models/Incident');

// @desc    Create a new incident (with or without image upload)
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req, res) => {
    let { type, description, location, urgency } = req.body;
    let imagePath = null;

    try {
        // If the request contains a file, multer processed it
        if (req.file) {
            imagePath = req.file.path.replace(/\\/g, "/"); // Normalize path
        }

        // Location needs special handling because it might be a JSON string from FormData
        // or already an object from a direct JSON body.
        let parsedLocation;
        if (typeof location === 'string') {
            try {
                parsedLocation = JSON.parse(location);
            } catch (parseError) {
                return res.status(400).json({ message: 'Invalid location format' });
            }
        } else {
            parsedLocation = location; // Already an object (e.g., from help request)
        }

        // Basic validation for parsedLocation
        if (!parsedLocation || !parsedLocation.type || !parsedLocation.coordinates) {
            return res.status(400).json({ message: 'Location data is incomplete or invalid.' });
        }


        const incident = new Incident({
            type,
            description,
            location: parsedLocation,
            urgency: urgency.toUpperCase(), // Ensure consistency with enum
            reportedBy: req.user._id,
            image: imagePath // Use the determined image path
        });

        const createdIncident = await incident.save();
        res.status(201).json(createdIncident);
    } catch (error) {
        console.error('--- CREATE INCIDENT ERROR ---', error);
        // Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: 'Could not create incident: Server Error' });
    }
};

// @desc    Get all incidents
// @route   GET /api/incidents
// @access  Private
const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find({})
            .populate('reportedBy', 'name email') // Replaces reportedBy ID with user's name and email
            .sort({ createdAt: -1 }); // Show newest incidents first
            
        res.json(incidents);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update an incident's status
// @route   PUT /api/incidents/:id/status
// @access  Private/Admin
const updateIncidentStatus = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (incident) {
            incident.status = req.body.status || incident.status; // Update status from request body
            const updatedIncident = await incident.save();
            res.json(updatedIncident);
        } else {
            res.status(404).json({ message: 'Incident not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Assign a volunteer to an incident
// @route   PUT /api/incidents/:id/assign
// @access  Private/Admin
const assignVolunteerToIncident = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({ message: 'Incident not found' });
        }

        const { volunteerId } = req.body;
        
        // Allow volunteers to assign themselves, or admins to assign anyone
        if (req.user.role !== 'ADMIN' && req.user._id.toString() !== volunteerId) {
            return res.status(403).json({ message: 'You can only assign yourself to incidents' });
        }

        incident.assignedTo = volunteerId;
        const updatedIncident = await incident.save();
        
        // Populate both fields in the response
        await updatedIncident.populate('reportedBy', 'name email');
        await updatedIncident.populate('assignedTo', 'name email');

        res.json(updatedIncident);
    } catch (error) {
        console.error('Failed to assign incident:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createIncident,
    getIncidents,
    updateIncidentStatus,
    assignVolunteerToIncident,
};