const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT||3000;
let clientCount = 0; // Track connected clients

app.use(cors()); // Enable CORS for frontend connections
app.set('trust proxy', true); // Enable proxy support in Express
// app.use(express.static('public')); // Serve HTML client

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get client IP address
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (clientIp === '::1') clientIp = '127.0.0.1'; // Convert IPv6 localhost to IPv4

    clientCount++; // Increment client count
    console.log(`Client connected from ${clientIp}. Total clients: ${clientCount}`);

    const sendData = () => {
        const aircraftData = {
            id: Math.floor(Math.random() * 1000),
            latitude: (Math.random() * 180 - 90).toFixed(6),
            longitude: (Math.random() * 360 - 180).toFixed(6),
            altitude: Math.floor(Math.random() * 40000),
            speed: Math.floor(Math.random() * 900),
            timestamp: new Date().toISOString()
        };

        res.write(`data: ${JSON.stringify(aircraftData)}\n\n`);
    };

    const interval = setInterval(sendData, 1000);

    req.on('close', () => {
        clientCount--; // Decrement count when client disconnects
        console.log(`Client disconnected from ${clientIp}. Total clients: ${clientCount}`);
        clearInterval(interval);
    });
});

app.listen(PORT, () => {
    console.log(`SSE Server running on http://localhost:${PORT}`);
});
