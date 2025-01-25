// updateUser.js
const express = require('express');
const { checkTokenMiddleware } = require('../Auth');
const { getTokens } = require('../tokenStorage');

const app = express();
app.use(express.json());

app.patch('/', checkTokenMiddleware, async (req, res) => {
    const axios = require('axios');
    const userUrl = 'https://api.zoom.us/v2/users/me';
    const userData = req.body; // Expect user data in the request body

    try {
        const tokens = getTokens();
        const response = await axios.patch(userUrl, userData, {
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

module.exports = app;
