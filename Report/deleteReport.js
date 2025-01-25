const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.delete('/:reportId', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const reportId = req.params.reportId;
    const reportUrl = `https://api.zoom.us/v2/reports/${reportId}`; // Example API endpoint for report deletion

    try {
        const tokens = getTokens();
        const response = await axios.delete(reportUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.status(204).send(); // No Content (Successful Deletion)
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
                message: 'Error occurred while deleting the report',
                details: error.message
            });
        }
    }
});


module.exports = app;
