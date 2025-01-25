const express = require('express');
const createMeeting = require('./createMeeting');
const listMeetings = require('./listMeetings');
const deleteMeeting = require('./deleteMeeting');
const webhookHandler = require('./webhookHandler');
const { app: authApp, checkTokenMiddleware } = require('./Auth'); // Import app and middleware
const updateMeeting = require('./updateMeeting');
require('dotenv').config();
const getMeeting = require('./getMeeting');
const getMeetingParticipants = require('./getMeetingParticipants');
/////////////////////// User routes ///////////////////////////////
const getUser = require('./user/getUser');
const listUserMeetings = require('./user/listUserMeetings');
const updateUser = require('./user/updateUser');
///////////////////////////////////////////////////////////////////

/////////////////////// recording routes ///////////////////////////////
const getRecording = require('./recording/getRecording');
const listRecordings = require('./recording/listRecordings');
const deleteRecording = require('./recording/deleteRecording');
/////////////////////////////////////////////////////////////////////////

/////////////////////// Registration routes ///////////////////////////////
const addMeetingRegistrant = require('./Registrant/addMeetingRegistrant');
const listMeetingRegistrants = require('./Registrant/listMeetingRegistrants');
const updateRegistrantStatus = require('./Registrant/updateRegistrantStatus');
/////////////////////////////////////////////////////////////////////////////

/////////////////////// Report routes ///////////////////////////////
const getReport = require('./Report/getReport');
const listReports = require('./Report/listReports');
const deleteReport = require('./Report/deleteReport');
const updateReport = require('./Report/updateReport');
const addReport = require('./Report/addReport');
const getReportParticipants = require('./Report/getMeetingParticipants');
////////////////////////////////////////////////////////
const signature = require('./signature');
const cors = require('cors');

const app = express();
const acceptedURL = ['https://sdk-test-5h1iuxbpz-abdulrahman-kbms-projects.vercel.app/','http://localhost:3000', 'https://localhost:3001', 'http://localhost:5173', 'https://0a0f-37-19-205-204.ngrok-free.app', 'https://marketplace.zoom.us/authorize?client_id=TDZ8rAMKT7aeZFW7iBdvqg&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Foauth%2Fcallback&_zmp_login_state=vR8TZ4kdSs6LhJzjsQRwmw']
app.use(cors({
    origin: acceptedURL,  // Specify the exact frontend origin
    credentials: true,  // Allow credentials (cookies, HTTP authentication)
    allowedHeaders: ['Content-Type', 'Authorization'],  // Allow these headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']  // Allowed methods
}));

// const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/webhookHandler', webhookHandler);
app.use('/createMeeting', createMeeting);
app.use('/listMeetings', listMeetings);
app.use('/deleteMeeting', deleteMeeting);
app.use('/auth', authApp); // Use auth routes (like /login)
app.use('/updateMeeting', updateMeeting);
app.use('/getMeeting', getMeeting);
app.use('/getMeetingParticipants', getMeetingParticipants);
///////////////////////////////////////////////////
app.use('/getUser', getUser);
app.use('/listUserMeetings', listUserMeetings);
app.use('/updateUser', updateUser);
///////////////////////////////////////////////////////
app.use('/getRecording', getRecording);
app.use('/listRecordings', listRecordings);
app.use('/deleteRecording', deleteRecording);
/////////////////////////////////////////////////
app.use('/addMeetingRegistrant', addMeetingRegistrant);
app.use('/listMeetingRegistrants', listMeetingRegistrants);
app.use('/updateRegistrantStatus', updateRegistrantStatus);
///////////////////////////////////////////////////////
app.use('/getReport', getReport);
app.use('/listReports', listReports);
app.use('/deleteReport', deleteReport);
app.use('/updateReport', updateReport);
app.use('/addReport', addReport);
app.use('/getReportParticipants', getReportParticipants);
/////////////////////////////////////////////////////
app.use('/signature', signature);

// Apply token middleware where necessary
app.use('/protected-route', checkTokenMiddleware, (req, res) => {
    res.send('This route is protected by token middleware.');
});

module.exports = app;
