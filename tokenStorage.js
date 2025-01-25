// // tokenStorage.js

// let tokens = {
//     access_token: null,
//     refresh_token: null,
//     expires_in: null,
//     last_updated: null
// };

// const saveTokens = (newTokens) => {
//     tokens.access_token = newTokens.access_token;
//     tokens.refresh_token = newTokens.refresh_token;
//     tokens.expires_in = newTokens.expires_in;
//     tokens.last_updated = Date.now();
// };

// const getTokens = () => {
//     return tokens;
// };

// const isTokenExpired = () => {
//     const now = Date.now();
//     if (!tokens.expires_in || !tokens.last_updated) return true;
//     return (now - tokens.last_updated) > tokens.expires_in * 1000;
// };

// const updateTokens = (newTokens) => {
//     tokens.access_token = newTokens.access_token;
//     tokens.refresh_token = newTokens.refresh_token;
//     tokens.expires_in = newTokens.expires_in;
//     tokens.last_updated = Date.now();
// };

// module.exports = {
//     saveTokens,
//     getTokens,
//     isTokenExpired,
//     updateTokens
// };
// tokenStorage.js
const fs = require('fs');
const path = require('path');

const tokenFilePath = path.join(__dirname, 'tokens.json');

// Helper to get current timestamp in milliseconds
const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

// Save tokens and calculate absolute expiration time
const saveTokens = (tokens) => {
    const expirationTimestamp = getCurrentTimestamp() + tokens.expires_in;  // Calculate absolute expiration time in seconds
    const tokenData = {
        ...tokens,
        expiration_time: expirationTimestamp // Store absolute expiration time
    };
    console.log('Saving tokens:', tokenData);  // Log saved tokens
    fs.writeFileSync(tokenFilePath, JSON.stringify(tokenData, null, 2));
};

// Retrieve tokens from file
const getTokens = () => {
    const tokens = fs.existsSync(tokenFilePath) ? JSON.parse(fs.readFileSync(tokenFilePath)) : {};
    console.log('Retrieved tokens:', tokens);  // Log retrieved tokens
    return tokens;
};

// Check if the token is expired by comparing current timestamp with expiration time
const isTokenExpired = () => {
    const tokens = getTokens();
    if (!tokens.access_token || !tokens.expiration_time) return true;
    return getCurrentTimestamp() >= tokens.expiration_time;  // Check if current time is past expiration time
};

// Update tokens with new data
const updateTokens = (tokens) => {
    const existingTokens = getTokens();
    saveTokens({
        ...existingTokens,
        ...tokens,
    });
};

// Clear tokens when invalid
const clearTokens = () => {
    console.log('Clearing tokens.');
    if (fs.existsSync(tokenFilePath)) {
        fs.unlinkSync(tokenFilePath);  // Delete the tokens file
    }
};

module.exports = { saveTokens, getTokens, isTokenExpired, updateTokens, clearTokens };
