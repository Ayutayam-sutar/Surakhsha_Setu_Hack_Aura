// models/SafetyCheck.js
const mongoose = require('mongoose');

const safetyCheckSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    status: {
        type: String,
        required: true,
        enum: ['SAFE', 'NEEDS_HELP'],
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
    },
    message: {
        type: String,
    },
}, {
    timestamps: true,
});

const SafetyCheck = mongoose.model('SafetyCheck', safetyCheckSchema);
module.exports = SafetyCheck;