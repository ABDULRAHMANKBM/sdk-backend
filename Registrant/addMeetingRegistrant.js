const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.post('/:meetingId/registrants', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const meetingId = req.params.meetingId;
    const registrantData = req.body; // Expect registrant details in the request body
    const registrantUrl = `https://api.zoom.us/v2/meetings/${meetingId}/registrants`;

    try {
        const tokens = getTokens();

        // Check if the required fields for a registrant are present
        if (!registrantData.email || !registrantData.first_name || !registrantData.last_name) {
            return res.status(400).json({
                message: "Missing required registrant fields: 'email', 'first_name', and 'last_name'.",
                received: registrantData
            });
        }

        const response = await axios.post(registrantUrl, registrantData, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.status(201).json(response.data);
    } catch (error) {
        // Enhanced error logging for better debugging
        console.error('Error posting registrant to Zoom:', error.message);

        if (error.response) {
            // If the error is related to the Zoom API response
            console.error('Zoom API response:', error.response.data);
            res.status(error.response.status).json({
                message: error.response.data.message || 'An error occurred while registering the participant.',
                details: error.response.data.errors || 'No additional details available.',
                zoomErrorCode: error.response.data.code
            });
        } else {
            // General error handling
            res.status(500).json({
                message: 'An error occurred while registering the participant.',
                error: error.message
            });
        }
    }
});

module.exports = app;
