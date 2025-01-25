const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.get('/', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const reportUrl = 'https://api.zoom.us/v2/reports'; // Example API endpoint for listing reports

    try {
        const tokens = getTokens();
        const response = await axios.get(reportUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).send({
                message: 'Error from Zoom API',
                details: error.response.data
            });
        } else if (error.request) {
            res.status(500).send({
                message: 'No response received from Zoom API',
                details: error.request
            });
        } else {
            res.status(500).send({
                message: 'Error occurred while listing the reports',
                details: error.message
            });
        }
    }
});


module.exports = app;
