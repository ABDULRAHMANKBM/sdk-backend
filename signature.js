// const express = require('express');
// const axios = require('axios');
// const jwt = require('jsonwebtoken');
// // const { getTokens, isTokenExpired, refreshToken } = require('./tokenStorage');  // Import the token storage functions
// // const { checkTokenMiddleware } = require('./Auth');

// const app = express();
// app.use(express.json());

// const generateSignature = (meetingNumber, role) => {
//     const apiKey = process.env.CLIENT_ID; // Your Client ID
//     const apiSecret = process.env.CLIENT_SECRET; // Your Client Secret

//     const payload = {
//         apiKey: apiKey, // Issuer
//         sdkKey: apiSecret,
//         exp: Math.floor(Date.now() / 1000) + 60 * 60, // Signature valid for 1 hour
//         meetingNumber: meetingNumber,
//         role: role, // 0 for participant, 1 for host
//     };

//     return jwt.sign(payload, apiSecret); // Generate and return the signature
// };

// app.post('/generate-signature', async (req, res) => {
//     const { meetingNumber, role } = req.body;
//     console.log("Received meetingNumber:", meetingNumber);

//     try {
//         // const tokens = getTokens();  // Get the current tokens
//         // const access_token = tokens.access_token;

//         // Generate the signature
//         const signature = generateSignature(meetingNumber, role);
//         console.log("Signature:", signature);

//         res.json({ signature });
//     } catch (error) {
//         console.error('Error generating signature:', error);
//         res.status(500).send('Failed to generate signature');
//     }
// });

// module.exports = app;


const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config(); // Load environment variables from a .env file

const app = express();
app.use(express.json());

// Function to generate the Zoom signature
const generateSignature = (meetingNumber, role, expirationSeconds = 60 * 60 * 2) => {
    const sdkKey = process.env.CLIENT_ID; // Your Zoom SDK Key
    const sdkSecret = process.env.CLIENT_SECRET; // Your Zoom SDK Secret

    const iat = Math.floor(Date.now() / 1000); // Current timestamp
    const exp = iat + expirationSeconds; // Expiration time

    // Create JWT payload
    const payload = {
        sdkKey: sdkKey,
        mn: meetingNumber,
        role: role, // 0 for participant, 1 for host
        iat: iat,
        exp: exp,
        tokenExp: exp,
    };

    // Return the signed JWT token
    return jwt.sign(payload, sdkSecret, { algorithm: 'HS256' });
};

// Route to generate the signature
app.post('/generate-signature', (req, res) => {
    const { meetingNumber, role, expirationSeconds } = req.body;

    console.log("Meeting number : ", meetingNumber, "  Role : ", role)
    // Simple validation for required fields
    if (!meetingNumber || typeof role === 'undefined') {
        return res.status(400).json({ error: 'Meeting number and role are required' });
    }

    // Default expiration to 2 hours if not provided
    const expSeconds = expirationSeconds ? parseInt(expirationSeconds) : 60 * 60 * 2;

    try {
        // Generate the signature
        const signature = generateSignature(meetingNumber, role, expSeconds);

        // Return the signature in the response
        res.json({ signature });
    } catch (error) {
        console.error('Error generating signature:', error);
        res.status(500).send('Failed to generate signature');
    }
});

module.exports = app;




// const express = require('express');
// const jwt = require('jsonwebtoken');
// require('dotenv').config(); // Load environment variables from a .env file

// const app = express();
// app.use(express.json());

// // Function to generate the Zoom signature
// const generateSignature = (meetingNumber, role, expirationSeconds = 60 * 60 * 2) => {
//     const sdkKey = process.env.CLIENT_ID; // Your Zoom SDK Key
//     const sdkSecret = process.env.CLIENT_SECRET; // Your Zoom SDK Secret

//     const iat = Math.floor(Date.now() / 1000); // Current timestamp
//     const exp = iat + expirationSeconds; // Expiration time

//     // Create JWT payload
//     const payload = {
//         sdkKey: sdkKey,
//         mn: meetingNumber,
//         role: role, // 0 for participant, 1 for host
//         iat: iat,
//         exp: exp,
//         tokenExp: exp,
//     };

//     // Return the signed JWT token
//     return jwt.sign(payload, sdkSecret, { algorithm: 'HS256' });
// };

// // Route to generate the signature
// app.post('/generate-signature', (req, res) => {
//     const { meetingNumber, role, expirationSeconds } = req.body;

//     // Simple validation for required fields
//     if (!meetingNumber || typeof role === 'undefined') {
//         return res.status(400).json({ error: 'Meeting number and role are required' });
//     }

//     // Default expiration to 2 hours if not provided
//     const expSeconds = expirationSeconds ? parseInt(expirationSeconds) : 60 * 60 * 2;

//     try {
//         // Generate the signature
//         const signature = generateSignature(meetingNumber, role, expSeconds);

//         // Return the signature in the response
//         res.json({ signature });
//     } catch (error) {
//         console.error('Error generating signature:', error);
//         res.status(500).send('Failed to generate signature');
//     }
// });

// module.exports = app;
