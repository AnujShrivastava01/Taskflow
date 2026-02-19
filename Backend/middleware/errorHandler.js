// =============================================================
// ERROR HANDLER MIDDLEWARE - middleware/errorHandler.js
// =============================================================
// Centralized error handling for the Express application.
//
// HOW IT WORKS:
// When any route handler calls next(error) or throws an error,
// Express skips all remaining middleware and jumps to this one
// (because it has 4 parameters: err, req, res, next).
//
// ERROR TYPES HANDLED:
// 1. Mongoose CastError - Invalid ObjectId (e.g., bad URL param)
// 2. Mongoose ValidationError - Schema validation failure
// 3. MongoDB Duplicate Key (code 11000) - Unique constraint violated
// 4. JWT JsonWebTokenError - Malformed token
// 5. JWT TokenExpiredError - Expired token
// 6. Generic errors - Any other unhandled errors
//
// WHY CENTRALIZED ERROR HANDLING?
// - DRY: Don't repeat error formatting in every controller
// - Consistent: All errors follow the same response format
// - Secure: Prevents leaking stack traces in production
// =============================================================

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', err);
    }

    // ----- Mongoose bad ObjectId (CastError) -----
    // Happens when a route like /api/tasks/:id receives an invalid MongoDB ID
    if (err.name === 'CastError') {
        error.message = 'Resource not found';
        return res.status(404).json({
            success: false,
            message: error.message,
        });
    }

    // ----- Mongoose Validation Error -----
    // Happens when required fields are missing or values don't match schema
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((val) => val.message);
        return res.status(400).json({
            success: false,
            message: messages.join(', '),
        });
    }

    // ----- MongoDB Duplicate Key Error -----
    // Happens when trying to create a document with a unique field that already exists
    // Most common: duplicate email during registration
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `An account with this ${field} already exists`,
        });
    }

    // ----- JWT Errors -----
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            message: 'Token has expired, please login again',
        });
    }

    // ----- Default Server Error -----
    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error',
    });
};

module.exports = errorHandler;
