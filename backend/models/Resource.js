// models/Resource.js
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Removes whitespace from both ends of a string
        },
        category: {
            type: String,
            required: true,
            enum: ['Food', 'Medical', 'Shelter', 'Clothing', 'Tools', 'Other'],
        },
        quantity: {
            type: Number,
            required: true,
            default: 0,
        },
        status: {
            type: String,
            required: true,
            enum: ['In Stock', 'Low', 'Out of Stock'],
            default: 'In Stock',
        },
        location: {
            type: String,
            required: true,
            trim: true,
            default: 'Central Warehouse',
        },
        // Link to the Admin/User who last updated this resource
        managedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;