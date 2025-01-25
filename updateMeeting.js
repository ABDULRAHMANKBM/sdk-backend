const express = require('express');
const axios = require('axios');
const router = express.Router();

// Route to update the meeting
router.patch('/:meetingId', async (req, res) => {
    const accessToken = req.body.accessToken; // Get access token from the request body
    const meetingId = req.params.meetingId;   // Meeting ID from the URL
    const updateData = req.body.updateData;   // Updated meeting data from the request body

    try {
        // Make a PATCH request to Zoom API to update the meeting
        await axios.patch(`https://api.zoom.us/v2/meetings/${meetingId}`, updateData, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Fetch the updated meeting details
        const meetingDetails = await axios.get(`https://api.zoom.us/v2/meetings/${meetingId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.json({
            message: `Meeting ${meetingId} updated successfully`,
            data: meetingDetails.data
        });
    } catch (error) {
        console.error('Error details:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
