// getUser.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.get('/', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const userUrl = 'https://api.zoom.us/v2/users/me';

    try {
        const tokens = getTokens();
        const response = await axios.get(userUrl, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error Response:', error.response ? error.response.data : error.message);
        res.status(500).send(`Error: ${error.response?.data?.message || error.message}`);
    }

});

module.exports = app;
