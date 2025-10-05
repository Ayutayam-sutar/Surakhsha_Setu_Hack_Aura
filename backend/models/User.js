const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            required: true,
            enum: ['USER', 'VOLUNTEER', 'ADMIN'],
            default: 'USER',
        },
        isAvailable: { type: Boolean, default: true },
        skills: { type: [String], default: [] },
        isSuspended: { type: Boolean, default: false },
        safetyStatus: {
            status: {
                type: String,
                enum: ['SAFE', 'NEEDS_HELP', 'UNKNOWN'],
                default: 'UNKNOWN',
            },
            timestamp: { type: Date }
        },
        // --- ADD THESE TWO FIELDS ---
        contact: { type: String },
        emergencyContact: { type: String },
        bio: { type: String }, // Also adding bio for volunteers
    },
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports = User;
