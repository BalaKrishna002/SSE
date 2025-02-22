const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT||3000;

// Enable CORS for all origins (or restrict to frontend domain if needed)
// app.use(cors({
//   origin: '*'
// }));
app.use(cors());

// Set CSP Header to allow SSE connections
// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3000");
//   next();
// });

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  console.log('Client connected to SSE');

  const sendData = () => {
      if (res.writableEnded) {
          console.log("Client disconnected, stopping data stream.");
          clearInterval(interval);
          return;
      }

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

  // Send heartbeat to keep connection alive
  // const sendHeartbeat = () => {
  //     if (!res.writableEnded) {
  //         res.write(': heartbeat\n\n'); // SSE comment, ignored by client
  //     }
  // };

  const interval = setInterval(sendData, 0);
  // const heartbeat = setInterval(sendHeartbeat, 10000); // Every 10 seconds

  req.on('close', () => {
      console.log('Client disconnected');
      clearInterval(interval);
      // clearInterval(heartbeat);
  });
});

app.listen(PORT, () => {
  console.log(`SSE Server running on http://localhost:${PORT}`);
});
