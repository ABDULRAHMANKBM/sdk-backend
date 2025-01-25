const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');
const axios = require('axios');

const app = express();
app.use(express.json());

// GET Participants Report for a specific meeting
app.get('/report/meetings/:meetingId/participants', checkTokenMiddleware, async (req, res) => {
    const meetingId = req.params.meetingId; // Get the meeting ID from the request URL
    const reportUrl = `https://api.zoom.us/v2/report/meetings/${meetingId}/participants`;

    try {
        // Retrieve stored access token
        const tokens = getTokens();

        // Make API call to Zoom to get participants data
        const response = await axios.get(reportUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });

        // Respond with participant data
        res.json(response.data);

    } catch (error) {
        if (error.response) {
            // Handle errors from Zoom API
            res.status(error.response.status).send({
                message: 'Error from Zoom API',
                details: error.response.data
            });
        } else if (error.request) {
            // Handle case where the request was made but no response was received
            res.status(500).send({
                message: 'No response received from Zoom API',
                details: error.request
            });
        } else {
            // General error handling
            res.status(500).send({
                message: 'Error occurred while retrieving participants data',
                details: error.message
            });
        }
    }
});

module.exports = app;
