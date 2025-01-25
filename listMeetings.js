// listMeetings.js

const express = require('express');
const { checkTokenMiddleware } = require('./Auth');  // Import the middleware
const { getTokens } = require('./tokenStorage');  // Import the token storage functions

const app = express();
app.use(express.json());

app.get('/', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const meetingsUrl = 'https://api.zoom.us/v2/users/me/meetings';

    try {
        const tokens = getTokens();  // Get the current tokens
        const response = await axios.get(meetingsUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`  // Use the access token from token storage
            }
        });
        res.json(response.data.meetings);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

module.exports = app;
