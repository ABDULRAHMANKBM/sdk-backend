// listUserMeetings.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.get('/user/:userId/meetings', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const userId = req.params.userId;
    const meetingsUrl = `https://api.zoom.us/v2/users/${userId}/meetings`;

    try {
        const tokens = getTokens();
        const response = await axios.get(meetingsUrl, {
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
