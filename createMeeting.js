const express = require('express');
const axios = require('axios');
const { checkTokenMiddleware } = require('./Auth');  // Import the middleware
const { getTokens, isTokenExpired, refreshToken } = require('./tokenStorage');  // Import the token storage functions
const router = express.Router();
require('dotenv').config();

router.post('/', checkTokenMiddleware, async (req, res) => {
    const createMeetingUrl = `https://api.zoom.us/v2/users/me/meetings`;

    const meetingData = {
        topic: 'SDK Test',
        type: 2, // Scheduled meeting
        start_time: '2025-01-20T15:00:00',
        duration: 60, // 1 hour
        timezone: 'America/New_York',
        settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
        }
    };

    try {
        const tokens = getTokens();  // Get the current tokens
        const response = await axios.post(createMeetingUrl, meetingData, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/json',
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

router.post('/createTwoMeetings', async (req, res) => {
    const createMeetingUrl = `https://api.zoom.us/v2/users/me/meetings`;
    // const hostEmail = "kassar.abode@gmail.com"; // Alternative host email

    // Meeting data for the first meeting
    const meetingData1 = {
        topic: 'Team Sync-Up - Meeting 1',
        type: 2, // Scheduled meeting
        start_time: '2024-10-13T15:00:00',
        duration: 60, // 1 hour
        timezone: 'America/New_York',
        settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
            // alternative_hosts: hostEmail,
        }
    };

    // Meeting data for the second meeting
    const meetingData2 = {
        topic: 'Team Sync-Up - Meeting 2',
        type: 2, // Scheduled meeting
        start_time: '2024-10-13T15:00:00',
        duration: 60, // 1 hour
        timezone: 'America/New_York',
        settings: {
            host_video: true,
            participant_video: true,
            join_before_host: false,
        }
    };

    try {
        const tokens = getTokens();  // Get the current tokens

        // Check if the token is expired and refresh if necessary
        if (isTokenExpired()) {
            await refreshToken();
            const updatedTokens = getTokens(); // Get the updated tokens after refreshing
        }

        // Create the first meeting
        const response1 = await axios.post(createMeetingUrl, meetingData1, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/json',
            }
        });

        // Create the second meeting
        const response2 = await axios.post(createMeetingUrl, meetingData2, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/json',
            }
        });

        // Return responses for both meetings
        res.json({
            meeting1: response1.data,
            meeting2: response2.data
        });
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});
module.exports = router;
