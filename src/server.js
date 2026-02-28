const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// API Gateway Routes
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});

app.post('/api/workflow/trigger', (req, res) => {
    const { workflowId, payload } = req.body;
    console.log(`Triggering worklow ${workflowId}`);

    // Simulate distributed processing and notify clients
    io.emit('workflow_update', { id: workflowId, status: 'processing' });

    setTimeout(() => {
        io.emit('workflow_update', { id: workflowId, status: 'completed' });
    }, 2000);

    res.json({ message: 'Workflow triggered successfully' });
});

// Real-time connection
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Distributed Workflow Backend running on port ${PORT}`);
});
