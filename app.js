const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT||3000;

let clientCount = 0; // Track connected clients

app.use(cors()); // Enable CORS for frontend connections
// app.use(express.static('public')); // Serve HTML client

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clientCount++; // Increment count when a client connects
    console.log(`Client connected. Total clients: ${clientCount}`);

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

    const interval = setInterval(sendData, 500);

    req.on('close', () => {
        clientCount--; // Decrement count when a client disconnects
        console.log(`Client disconnected. Total clients: ${clientCount}`);
        clearInterval(interval);
    });
});

app.listen(PORT, () => {
    console.log(`SSE Server running on http://localhost:${PORT}`);
});
