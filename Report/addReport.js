const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.post('/', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const reportUrl = 'https://api.zoom.us/v2/reports/add'; // Example API endpoint for report add
    const reportData = req.body;

    try {
        const tokens = getTokens();
        const response = await axios.post(reportUrl, reportData, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            // Handle errors coming from Zoom API
            res.status(error.response.status).send({
                message: 'Error from Zoom API',
                details: error.response.data
            });
        } else if (error.request) {
            // Handle errors where the request was made but no response was received
            res.status(500).send({
                message: 'No response received from Zoom API',
                details: error.request
            });
        } else {
            // General error
            res.status(500).send({
                message: 'Error occurred while creating the report',
                details: error.message
            });
        }
    }
});

module.exports = app;
