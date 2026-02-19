// =============================================================
// AUTH ROUTES - routes/authRoutes.js
// =============================================================
// Defines all authentication-related API endpoints.
//
// ROUTE MAP:
// POST   /api/auth/register  → Register new user (public)
// POST   /api/auth/login     → Login user (public)
// GET    /api/auth/me        → Get current user (protected)
// PUT    /api/auth/profile   → Update profile (protected)
// PUT    /api/auth/password  → Change password (protected)
//
// VALIDATION:
// We use express-validator to validate request bodies BEFORE
// they reach the controller. This is the first layer of defense.
// The controller checks validationResult() for any errors.
//
// WHY VALIDATE IN ROUTES?
// - Separation of concerns: Routes define WHAT data is expected
// - Controllers focus on business logic, not input validation
// - express-validator provides clear, chainable validation rules
// =============================================================

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const {
    register,
    login,
    getMe,
    updateProfile,
    updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ----- PUBLIC ROUTES -----

// Register with validation
router.post(
    '/register',
    [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 50 })
            .withMessage('Name must be 2-50 characters'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
    ],
    register
);

// Login with validation
router.post(
    '/login',
    [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    login
);

// ----- PROTECTED ROUTES (require auth token) -----

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);

module.exports = router;
