// deleteRecording.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.delete('/:meetingId', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const meetingId = req.params.meetingId;
    const recordingUrl = `https://api.zoom.us/v2/meetings/${meetingId}/recordings`;

    try {
        const tokens = getTokens();
        await axios.delete(recordingUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

module.exports = app;
