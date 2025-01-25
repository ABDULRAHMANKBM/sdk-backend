require('dotenv').config();
const http = require('http');
const app = require('./index');

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
