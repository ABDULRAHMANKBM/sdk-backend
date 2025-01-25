// listMeetingRegistrants.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.get('/:meetingId/registrants', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const meetingId = req.params.meetingId;
    const registrantsUrl = `https://api.zoom.us/v2/meetings/${meetingId}/registrants`;

    try {
        const tokens = getTokens();
        const response = await axios.get(registrantsUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data.registrants);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

module.exports = app;
