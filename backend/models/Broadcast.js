// models/Broadcast.js
const mongoose = require('mongoose');

const broadcastSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        targetAudience: {
            type: String,
            required: true,
            enum: ['ALL_USERS', 'ALL_VOLUNTEERS', 'ADMINS_ONLY'],
        },
        sentBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User', // Link to the Admin User who sent it
        },
    },
    {
        timestamps: true,
    }
);

const Broadcast = mongoose.model('Broadcast', broadcastSchema);

module.exports = Broadcast;