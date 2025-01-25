// getMeetingParticipants.js

/// work for paid version only

const express = require('express');
const { checkTokenMiddleware } = require('./Auth');
const { getTokens } = require('./tokenStorage');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/:uuid/participants', checkTokenMiddleware, async (req, res) => {
    const meetingId = decodeURIComponent(req.params.uuid); // Decode the UUID

    // Endpoint to get meeting details
    const meetingUrl = `https://api.zoom.us/v2/meetings/${meetingId}`;

    try {
        const tokens = getTokens(); // Get current tokens

        // First try to fetch details of an in-progress meeting
        let meetingResponse = await axios.get(meetingUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });

        const meetingStatus = meetingResponse.data.status;
        console.log('Meeting Status:', meetingStatus);

        // If meeting is not in-progress, return an appropriate message
        if (meetingStatus !== 'in_progress') {
            return res.status(400).json({ message: 'Meeting has not started yet or has already ended.' });
        }

        // Now fetch participants for an in-progress meeting
        const participantsUrl = `https://api.zoom.us/v2/meetings/${meetingId}/participants`;
        const participantsResponse = await axios.get(participantsUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });

        const participants = participantsResponse.data.participants; // Get participants

        if (!participants || participants.length === 0) {
            return res.json({ message: 'No participants found for this meeting.' });
        }

        res.json(participants); // Return participants list
    } catch (error) {
        // If the meeting is not found, try fetching from past meetings
        if (error.response && error.response.data.code === 3001) {
            console.log('Meeting not found, trying past meeting API...');

            try {
                const tokens = getTokens();
                // Use past meetings API to get participants after meeting ends
                const pastParticipantsUrl = `https://api.zoom.us/v2/past_meetings/${meetingId}/participants`;
                const pastParticipantsResponse = await axios.get(pastParticipantsUrl, {
                    headers: {
                        Authorization: `Bearer ${tokens.access_token}`
                    }
                });

                const pastParticipants = pastParticipantsResponse.data.participants;

                if (!pastParticipants || pastParticipants.length === 0) {
                    return res.json({ message: 'No participants found for this past meeting.' });
                }

                return res.json(pastParticipants);
            } catch (pastError) {
                // Improved logging for past meeting API errors
                console.error('Error fetching past meeting participants:', pastError.response?.data || pastError.message);
                return res.status(500).send(pastError.response?.data?.message || 'Error fetching past meeting participants.');
            }
        }

        console.error('Error fetching participants:', error.response?.data || error.message);
        if (error.response) {
            // Log specific error from Zoom API
            console.error('Zoom API error response:', error.response.data);
            return res.status(error.response.status).send(error.response.data.message || 'An error occurred while fetching participants.');
        } else {
            return res.status(500).send(`Error: ${error.message}`);
        }
    }
});

module.exports = app;
