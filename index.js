import express from 'express';
import { createServer } from 'node:http';
import { wispServer } from 'wisp-server-node';

const app = express();
const server = createServer(app);

// Simple status check to make sure your backend is awake
app.get('/', (req, res) => {
    res.send('Proxe Backend Engine: Active and Operational.');
});

// Handle the secure Wisp video streaming connections for YouTube/TikTok
server.on('upgrade', (req, socket, head) => {
    if (req.url.startsWith('/wisp/')) {
        wispServer.handleUpgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Backend routing live on port ${PORT}`);
});
