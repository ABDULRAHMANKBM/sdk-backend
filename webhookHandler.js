const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`Received Zoom event: ${event}`);
    console.log(`Payload:`, payload);

    switch (event) {
        case 'meeting.started':
            console.log(`Meeting ${payload.object.id} started`);
            break;
        case 'meeting.ended':
            console.log(`Meeting ${payload.object.id} ended`);
            break;
        case 'meeting.created':
            console.log(`Meeting ${payload.object.id} created`);
            break;
        case 'participant.joined':
            console.log(`Participant ${payload.participant.user_name} joined meeting ${payload.object.id}`);
            break;
        case 'participant.left':
            console.log(`Participant ${payload.participant.user_name} left meeting ${payload.object.id}`);
            break;
        default:
            console.log('Unhandled event:', event);
    }

    // Respond with 200 OK to acknowledge receipt
    res.sendStatus(200);
});

module.exports = router;


