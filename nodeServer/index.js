const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

const app = express();

// Enable CORS for all routes
app.use(cors());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// Start the server
const server = app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});

const io = new Server(server, {
    cors: {
        origin: "http://127.0.0.1:5500", // Replace with your actual origin
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {
    // Handle new user joining
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // Handle message sending
    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // Handle user disconnecting
    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
