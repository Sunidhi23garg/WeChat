const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const server = app.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});

const io = new Server(server, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
        methods: ["GET", "POST"],
    },
});

const users = {};

io.on('connection', (socket) => {
    socket.on('new-user-joined', (name) => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
