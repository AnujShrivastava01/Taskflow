// =============================================================
// SERVER ENTRY POINT - server.js
// =============================================================
// This is the main file that starts the Express server.
//
// WHAT HAPPENS WHEN YOU RUN THIS FILE:
// 1. Load environment variables from .env
// 2. Connect to MongoDB
// 3. Configure Express middleware (CORS, JSON parsing, security)
// 4. Mount API routes
// 5. Attach error handler
// 6. Start listening on the configured port
//
// MIDDLEWARE ORDER MATTERS:
// - helmet() first: Sets security headers
// - cors(): Enables cross-origin requests from frontend
// - express.json(): Parses JSON request bodies
// - morgan(): Logs HTTP requests (dev only)
// - Routes: API endpoint handlers
// - errorHandler: Catches any errors from routes (MUST be last)
//
// ARCHITECTURE:
// Client → Express Server → Middleware Pipeline → Routes → Controllers → MongoDB
//                                                                    ↓
//                                              Response ← Controller Result
// =============================================================

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables FIRST (before anything else uses them)
dotenv.config();

// Connect to database
connectDB();

// Initialize Express
const app = express();

// =============================================================
// SECURITY MIDDLEWARE
// =============================================================
// helmet(): Sets various HTTP security headers:
// - X-Content-Type-Options: nosniff (prevents MIME sniffing)
// - X-Frame-Options: SAMEORIGIN (prevents clickjacking)
// - X-XSS-Protection: 1 (enables XSS filter)
// - Strict-Transport-Security (forces HTTPS)
// - And more...
// =============================================================
app.use(helmet());

// =============================================================
// CORS (Cross-Origin Resource Sharing)
// =============================================================
// Without CORS, the browser would block requests from 
// http://localhost:5173 (frontend) to http://localhost:5000 (backend)
// because they're on different ports (different origins).
//
// We configure CORS to:
// - Allow requests from our frontend URL
// - Allow credentials (cookies, authorization headers)
// - Allow specific HTTP methods and headers
// =============================================================
app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// =============================================================
// BODY PARSER
// =============================================================
// express.json(): Parses incoming JSON request bodies
// Makes req.body available in route handlers
// limit: '10mb' prevents oversized request bodies (DoS protection)
// =============================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =============================================================
// REQUEST LOGGING (Development only)
// =============================================================
// morgan('dev') logs: METHOD URL STATUS RESPONSE_TIME - SIZE
// Example: GET /api/tasks 200 15.234 ms - 542
// =============================================================
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// =============================================================
// API ROUTES
// =============================================================
// All routes are prefixed with /api/ for clear separation
// This makes it easy to proxy in production (nginx, etc.)
// =============================================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// ----- Health check endpoint -----
// Useful for monitoring and load balancer health checks
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// ----- 404 handler for unknown routes -----
app.all('/{*path}', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

// =============================================================
// CENTRALIZED ERROR HANDLER (must be LAST middleware)
// =============================================================
app.use(errorHandler);

// =============================================================
// START SERVER
// =============================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`
  ╔═══════════════════════════════════════════════╗
  ║                                               ║
  ║   🚀 Server running on port ${PORT}              ║
  ║   📍 Environment: ${process.env.NODE_ENV || 'development'}            ║
  ║   🔗 URL: http://localhost:${PORT}               ║
  ║                                               ║
  ╚═══════════════════════════════════════════════╝
  `);
});

module.exports = app;
