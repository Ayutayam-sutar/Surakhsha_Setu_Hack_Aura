// controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('--- REGISTRATION ERROR ---', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                // ADD THESE:
                contact: user.contact,
                emergencyContact: user.emergencyContact,
                bio: user.bio,
                isAvailable: user.isAvailable,
                skills: user.skills,
                isSuspended: user.isSuspended,
                safetyStatus: user.safetyStatus,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('--- LOGIN ERROR ---', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requires token)
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isAvailable: user.isAvailable, 
            skills: user.skills,
            // ADD THESE MISSING FIELDS:
            contact: user.contact,
            emergencyContact: user.emergencyContact,
            bio: user.bio,
            isSuspended: user.isSuspended,
            safetyStatus: user.safetyStatus,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update user status (Admin only)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            // Only update the isSuspended field from the request body
            user.isSuspended = req.body.isSuspended;
            await user.save();
            // Return the updated user to the frontend
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Add this new function to backend/controllers/userController.js

const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.contact = req.body.contact || user.contact; // <-- ADD THIS
        user.emergencyContact = req.body.emergencyContact || user.emergencyContact; // <-- ADD THIS
        
        if (user.role === 'VOLUNTEER') {
            // Use '??' to allow setting availability to 'false'
            user.isAvailable = req.body.isAvailable ?? user.isAvailable; 
            user.skills = req.body.skills || user.skills;
            user.bio = req.body.bio || user.bio; // <-- ADD THIS
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            isAvailable: updatedUser.isAvailable,
            skills: updatedUser.skills,
            contact: updatedUser.contact,
            emergencyContact: updatedUser.emergencyContact,
            bio: updatedUser.bio,
            token: generateToken(updatedUser._id), // Re-issue token
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// Make sure your exports include everything
module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    getAllUsers, 
    updateUserStatus,
    updateUserProfile 
};