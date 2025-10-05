// controllers/resourceController.js
const Resource = require('../models/Resource');

// @desc    Create a new resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
    const { name, category, quantity, location } = req.body;

    try {
        const resource = new Resource({
            name,
            category,
            quantity,
            location,
            managedBy: req.user._id, // Set the manager to the logged-in admin
        });

        // Automatically set status based on quantity
        if (quantity === 0) {
            resource.status = 'Out of Stock';
        } else if (quantity < 20) { // Arbitrary "low" threshold
            resource.status = 'Low';
        }

        const createdResource = await resource.save();
        res.status(201).json(createdResource);
    } catch (error) {
        res.status(400).json({ message: 'Could not create resource', error: error.message });
    }
};

// @desc    Get all resources
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({})
            .populate('managedBy', 'name') // Show the name of the manager
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a resource's quantity
// @route   PUT /api/resources/:id
// @access  Private/Admin
const updateResource = async (req, res) => {
    const { quantity } = req.body;

    try {
        const resource = await Resource.findById(req.params.id);

        if (resource) {
            resource.quantity = quantity;
            resource.managedBy = req.user._id; // Track who made the update

            // Automatically update the status
            if (resource.quantity <= 0) {
                resource.quantity = 0;
                resource.status = 'Out of Stock';
            } else if (resource.quantity < 20) {
                resource.status = 'Low';
            } else {
                resource.status = 'In Stock';
            }

            const updatedResource = await resource.save();
            res.json(updatedResource);
        } else {
            res.status(404).json({ message: 'Resource not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createResource, getResources, updateResource };