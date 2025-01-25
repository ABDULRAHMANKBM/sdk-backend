const express = require('express');
const axios = require('axios');
const router = express.Router();

router.delete('/:meetingId', async (req, res) => {
    console.log("entering deleteMeeting.js");
    const accessToken = req.body.accessToken; // Get token from request body
    const meetingId = req.params.meetingId;

    try {
        await axios.delete(`https://api.zoom.us/v2/meetings/${meetingId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        res.send(`Meeting ${meetingId} deleted successfully`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
