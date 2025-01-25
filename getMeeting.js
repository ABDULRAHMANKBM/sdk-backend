// getMeeting.js
const express = require('express');
const { checkTokenMiddleware } = require('./Auth');
const { getTokens } = require('./tokenStorage');

const app = express();
app.use(express.json());

app.get('/:meetingId', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const meetingId = req.params.meetingId;
    const meetingUrl = `https://api.zoom.us/v2/meetings/${meetingId}`;

    try {
        const tokens = getTokens();
        const response = await axios.get(meetingUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

module.exports = app;
