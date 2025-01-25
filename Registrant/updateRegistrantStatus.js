// updateRegistrantStatus.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.put('/:meetingId/registrants/status', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const meetingId = req.params.meetingId;
    const statusData = req.body; // Expect status update data in the request body
    const statusUrl = `https://api.zoom.us/v2/meetings/${meetingId}/registrants/status`;

    try {
        const tokens = getTokens();
        const response = await axios.put(statusUrl, statusData, {
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
