
const express = require('express');
const { KJUR } = require('jsrsasign'); // Import KJUR for generating JWT

require('dotenv').config(); // Load environment variables from a .env file

const app = express();
app.use(express.json());

// Function to generate the Zoom signature
const generateSignature = (meetingNumber, role, expirationSeconds = 60 * 60 * 2) => {
    const iat = Math.floor(Date.now() / 1000); // Current timestamp
    const exp = expirationSeconds ? iat + expirationSeconds : iat + 60 * 60 * 2; // Expiration time

    const oHeader = { alg: 'HS256', typ: 'JWT' }; // JWT header
    const oPayload = {
        appKey: process.env.CLIENT_ID,
        sdkKey: process.env.CLIENT_ID,
        mn: meetingNumber,
        role: role, // 0 for participant, 1 for host
        iat: iat,
        exp: exp,
        tokenExp: exp,
    };

    const sHeader = JSON.stringify(oHeader); // Convert header to JSON string
    const sPayload = JSON.stringify(oPayload); // Convert payload to JSON string

    // Sign the JWT using the SDK secret
    return KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.CLIENT_SECRET);
};

// Route to generate the signature
app.post('/generate-signature', (req, res) => {
    const { meetingNumber, role, expirationSeconds } = req.body;

    console.log('Meeting number:', meetingNumber, 'Role:', role);

    // Simple validation for required fields
    if (!meetingNumber || typeof role === 'undefined') {
        return res.status(400).json({ error: 'Meeting number and role are required' });
    }

    try {
        // Generate the signature
        const signature = generateSignature(meetingNumber, role, expirationSeconds);

        // Return the signature in the response
        res.json({ signature });
    } catch (error) {
        console.error('Error generating signature:', error);
        res.status(500).send('Failed to generate signature');
    }
});

module.exports = app;
