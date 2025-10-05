// models/Incident.js
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            required: true,
            enum: ['Medical', 'Fire', 'Flood', 'Rescue', 'Other'],
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true,
            },
            address: { // Optional: A user-friendly address string
                type: String,
            }
        },
        urgency: {
            type: String,
            required: true,
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: 'MEDIUM',
        },
        status: {
            type: String,
            required: true,
            enum: ['Reported', 'In Progress', 'Resolved'],
            default: 'Reported',
        },
        reportedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        // NEW FIELD to store the path to the uploaded image
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;