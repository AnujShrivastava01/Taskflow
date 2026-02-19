// =============================================================
// USER MODEL - models/User.js
// =============================================================
// This defines the User schema for MongoDB using Mongoose.
//
// SCHEMA FIELDS:
// - name: User's full name (required, 2-50 chars)
// - email: User's email (required, unique, validated format)
// - password: Hashed password (required, min 6 chars, excluded from queries by default)
// - avatar: Profile picture URL (optional, defaults to a placeholder)
// - bio: Short user biography (optional)
// - createdAt: Auto-generated timestamp
//
// MIDDLEWARE:
// - pre('save'): Automatically hashes the password before saving
//   This runs ONLY when password is modified (not on every save)
//
// METHODS:
// - matchPassword(): Compares entered password with stored hash
//   Uses bcrypt.compare() which is timing-safe (prevents timing attacks)
//
// SECURITY NOTES:
// - password field has `select: false` - it won't be returned in queries
//   unless explicitly requested with .select('+password')
// - bcrypt salt rounds = 12 for strong but performant hashing
// =============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide your name'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email address',
            ],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Don't return password in queries by default
        },
        avatar: {
            type: String,
            default: '',
        },
        bio: {
            type: String,
            maxlength: [250, 'Bio cannot exceed 250 characters'],
            default: '',
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields automatically
    }
);

// =============================================================
// PRE-SAVE MIDDLEWARE - Hash password before saving
// =============================================================
// This middleware runs before every .save() call on a User document.
// It checks if the password field was modified:
// - If YES: hash the new password with bcrypt (12 salt rounds)
// - If NO: skip hashing (e.g., when updating name or email)
// =============================================================
UserSchema.pre('save', async function () {
    // Only hash if password was modified
    if (!this.isModified('password')) {
        return;
    }

    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// =============================================================
// INSTANCE METHOD - Compare entered password with stored hash
// =============================================================
// Usage: const isMatch = await user.matchPassword('enteredPassword');
// bcrypt.compare() handles the salt extraction and comparison
// It's timing-safe, meaning it takes the same time regardless
// of where the mismatch occurs (prevents timing attacks)
// =============================================================
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
