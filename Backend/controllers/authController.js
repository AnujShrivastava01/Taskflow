// =============================================================
// AUTH CONTROLLER - controllers/authController.js
// =============================================================
// Handles all authentication-related operations:
// 1. register - Create a new user account
// 2. login - Authenticate and return a JWT token
// 3. getMe - Get the currently logged-in user's profile
// 4. updateProfile - Update user's name, email, bio, avatar
// 5. updatePassword - Change password (requires current password)
//
// EACH FUNCTION FOLLOWS THIS PATTERN:
// 1. Validate input
// 2. Perform database operation
// 3. Return success response with data
// 4. Or throw/return error for the error handler
// =============================================================

const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validationResult } = require('express-validator');

// =============================================================
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public (no token required)
// =============================================================
// FLOW:
// 1. Validate request body (name, email, password)
// 2. Check if email already exists
// 3. Create new user (password auto-hashed by pre-save middleware)
// 4. Generate JWT token
// 5. Return user data + token
// =============================================================
const register = async (req, res, next) => {
    try {
        // Check for validation errors from express-validator
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array().map((e) => e.msg).join(', '),
            });
        }

        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists',
            });
        }

        // Create new user - password will be hashed by the pre-save hook
        const user = await User.create({ name, email, password });

        // Generate JWT token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                createdAt: user.createdAt,
            },
            token,
        });
    } catch (error) {
        next(error); // Pass to centralized error handler
    }
};

// =============================================================
// @desc    Login user & return JWT token
// @route   POST /api/auth/login
// @access  Public
// =============================================================
// FLOW:
// 1. Validate email and password are provided
// 2. Find user by email (explicitly select password field)
// 3. Compare entered password with stored hash
// 4. If match: return user data + new JWT token
// 5. If no match: return 401 Unauthorized
//
// SECURITY NOTE:
// We use a generic "Invalid credentials" message for both
// wrong email and wrong password. This prevents attackers
// from discovering which emails are registered.
// =============================================================
const login = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: errors.array().map((e) => e.msg).join(', '),
            });
        }

        const { email, password } = req.body;

        // Find user and include password field (normally excluded by select: false)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Compare entered password with stored hash
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                createdAt: user.createdAt,
            },
            token,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Get current logged-in user's profile
// @route   GET /api/auth/me
// @access  Private (token required)
// =============================================================
// This route is protected by the auth middleware.
// req.user is already populated by the middleware.
// We simply return it.
// =============================================================
const getMe = async (req, res, next) => {
    try {
        // req.user was set by the auth middleware
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Update user profile (name, email, bio, avatar)
// @route   PUT /api/auth/profile
// @access  Private
// =============================================================
// NOTE: This does NOT update the password.
// Password changes have a separate endpoint for security.
// =============================================================
const updateProfile = async (req, res, next) => {
    try {
        const { name, email, bio, avatar } = req.body;

        // Build update object with only provided fields
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (email !== undefined) updateFields.email = email;
        if (bio !== undefined) updateFields.bio = bio;
        if (avatar !== undefined) updateFields.avatar = avatar;

        // Check if new email is already taken by another user
        if (email && email !== req.user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already in use',
                });
            }
        }

        const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators on update
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

// =============================================================
// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
// =============================================================
// FLOW:
// 1. Get current password and new password from request
// 2. Find user with password field included
// 3. Verify current password matches
// 4. Set new password (pre-save middleware will hash it)
// 5. Save and return new JWT token
// =============================================================
const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide current and new password',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters',
            });
        }

        // Get user with password field
        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect',
            });
        }

        // Set new password (will be hashed by pre-save middleware)
        user.password = newPassword;
        await user.save();

        // Generate new token (good security practice after password change)
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            token,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
};
