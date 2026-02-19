// =============================================================
// JWT TOKEN GENERATOR - utils/generateToken.js
// =============================================================
// Creates a signed JWT token for a given user ID.
//
// HOW JWT WORKS:
// 1. jwt.sign() creates a token with 3 parts:
//    HEADER.PAYLOAD.SIGNATURE
//
//    - HEADER: Algorithm used (HS256) and token type (JWT)
//    - PAYLOAD: Our data - the user's MongoDB _id
//    - SIGNATURE: HMAC-SHA256 hash of header + payload + secret
//
// 2. The token is sent to the client and stored (localStorage/cookie)
// 3. For protected routes, the client sends the token in headers
// 4. The server verifies the signature to ensure:
//    - The token was created by this server (has our secret)
//    - The payload hasn't been tampered with
//    - The token hasn't expired
//
// EXPIRATION:
// - Token expires after JWT_EXPIRE duration (default: 7 days)
// - After expiry, user must login again to get a new token
// - This limits damage if a token is stolen
// =============================================================

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign(
        { id }, // Payload: user's MongoDB ObjectId
        process.env.JWT_SECRET, // Secret key for signing
        { expiresIn: process.env.JWT_EXPIRE || '7d' } // Expiration time
    );
};

module.exports = generateToken;
