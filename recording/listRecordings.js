// listRecordings.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.get('/', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const recordingsUrl = 'https://api.zoom.us/v2/users/me/recordings';

    try {
        const tokens = getTokens();
        const response = await axios.get(recordingsUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data.meetings);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

module.exports = app;
