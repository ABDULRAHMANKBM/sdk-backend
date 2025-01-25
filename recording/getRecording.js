// getRecording.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/:meetingId', checkTokenMiddleware, async (req, res) => {
    const meetingId = req.params.meetingId;
    const recordingUrl = `https://api.zoom.us/v2/meetings/${meetingId}/recordings`;

    try {
        const tokens = getTokens();
        const response = await axios.get(recordingUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Zoom API Error:', error.response ? error.response.data : error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: 'Recording not found or not saved to cloud.' });
        } else {
            res.status(500).send(`Error: ${error.message}`);
        }
    }
});

module.exports = app;
