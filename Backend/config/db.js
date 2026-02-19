// =============================================================
// DATABASE CONNECTION - config/db.js
// =============================================================
// This file handles the MongoDB connection using Mongoose.
//
// HOW IT WORKS:
// 1. We import mongoose (the MongoDB ODM for Node.js)
// 2. We define an async function that attempts to connect to MongoDB
// 3. We use the MONGO_URI from our .env file
// 4. On success: logs the connection host
// 5. On failure: logs the error and exits the process
//
// WHY mongoose?
// - Provides schema-based data modeling
// - Built-in validation, casting, and business logic hooks
// - Makes MongoDB operations feel like working with JS objects
// =============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit with failure code
    }
};

module.exports = connectDB;
