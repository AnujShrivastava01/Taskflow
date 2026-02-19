// =============================================================
// AUTH MIDDLEWARE - middleware/auth.js
// =============================================================
// This middleware protects routes that require authentication.
//
// HOW IT WORKS:
// 1. Client sends a request with an Authorization header:
//    Authorization: Bearer <jwt_token>
// 2. This middleware extracts the token from the header
// 3. Verifies the token using jwt.verify() with our secret
// 4. Finds the user in the database using the ID from the token
// 5. Attaches the user object to req.user
// 6. Calls next() to proceed to the actual route handler
//
// IF TOKEN IS INVALID/MISSING:
// - Returns 401 Unauthorized with an error message
//
// USAGE:
// router.get('/protected-route', protect, controllerFunction);
//
// FLOW DIAGRAM:
// Request → [Auth Middleware] → Is token present?
//   NO  → 401 "Not authorized"
//   YES → Is token valid?
//     NO  → 401 "Token invalid"
//     YES → Find user by ID from token
//       NOT FOUND → 401 "User not found"
//       FOUND     → Attach user to req → next()
// =============================================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    // Check for Bearer token in Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token from "Bearer <token>"
            token = req.headers.authorization.split(' ')[1];

            // Verify the token and decode its payload
            // jwt.verify() throws an error if token is invalid or expired
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID from token payload
            // .select('-password') ensures password isn't included
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User belonging to this token no longer exists',
                });
            }

            next(); // Proceed to the next middleware/route handler
        } catch (error) {
            console.error('Auth middleware error:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed verification',
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized, no token provided',
        });
    }
};

module.exports = { protect };
