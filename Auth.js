const express = require('express');
const axios = require('axios');
require('dotenv').config();
const { saveTokens, getTokens, isTokenExpired, updateTokens, clearTokens } = require('./tokenStorage');

const app = express();
app.use(express.json());

app.get('/login', async (req, res) => {
    const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URL}`;
    const open = (await import('open')).default;
    open(zoomAuthUrl);
    res.send('Opening Zoom login page...');
});

app.get('/oauth/callback', async (req, res) => {
    const authCode = req.query.code;

    console.log('Received auth code:', authCode); // Log the received auth code
    try {
        const tokenResponse = await axios.post(`https://zoom.us/oauth/token`, null, {
            params: {
                grant_type: 'authorization_code',
                code: authCode,
                redirect_uri: process.env.REDIRECT_URL
            },
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        console.log('Token response:', tokenResponse.data); // Log token response
        saveTokens({
            access_token: tokenResponse.data.access_token,
            refresh_token: tokenResponse.data.refresh_token,
            expires_in: tokenResponse.data.expires_in
        });

        res.send(`Access Token: ${tokenResponse.data.access_token}`);
    } catch (error) {
        res.status(500).send(`Error: ${error.message}`);
    }
});

// Middleware to refresh the token if expired
const refreshToken = async () => {
    const tokens = getTokens();
    if (!tokens.refresh_token) {
        throw new Error('No refresh token available');
    }

    try {
        const response = await axios.post('https://zoom.us/oauth/token', null, {
            params: {
                grant_type: 'refresh_token',
                refresh_token: tokens.refresh_token
            },
            headers: {
                Authorization: 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        updateTokens({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in
        });
    } catch (error) {
        if (error.response?.data?.reason === 'Invalid Token' || error.response?.status === 401) {
            console.log('Refresh token has expired or is invalid. Clearing tokens.');
            clearTokens();  // Clear tokens if refresh token is invalid
            throw new Error('Refresh token expired. Please log in again.');
        }
        console.error('Zoom API error response:', error.response?.data);
        throw new Error('Failed to refresh token: ' + error.message);
    }
};

// Middleware to check if token is expired and refresh if needed
const checkTokenMiddleware = async (req, res, next) => {
    if (isTokenExpired()) {
        try {
            await refreshToken();
        } catch (error) {
            console.error('Error refreshing token:', error);
            return res.status(401).send('Unauthorized: Unable to refresh access token. Please log in again.');
        }
    }
    next();
};

module.exports = {
    app,
    checkTokenMiddleware
};
