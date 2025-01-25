const express = require('express');
const axios = require('axios');
const meetingId = '987654321';

axios.get(`https://api.zoom.us/v2/report/meetings/${meetingId}/participants`, {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
    },
}).then(response => {
    console.log('Meeting Report:', response.data);
}).catch(error => {
    console.error('Error fetching meeting report:', error);
});