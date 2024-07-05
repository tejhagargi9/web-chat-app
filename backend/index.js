const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});

let activeUsers = {};

io.on("connection", (socket) => {
    console.log('Connected');

    socket.on("join", (userName) => {
        activeUsers[socket.id] = userName;
        io.emit("activeUsers", Object.values(activeUsers));
    }); 

    socket.on("chat", (payload) => {
        socket.broadcast.emit("chat", payload); 
    
    socket.on('disconnect', () => {
        console.log('Disconnected');
        delete activeUsers[socket.id];
        io.emit("activeUsers", Object.values(activeUsers));
    });
});

server.listen(3000, () => console.log('Server is listening at port 3000'));
