    const express = require('express')
    const http = require('http')
    const socketio = require('socket.io')

    const app = express()
    const server = http.createServer(app)
    const io = socketio(server, {
        cors : {
            origin : "*"
        }
    })


    io.on("connection", (socket) => {
        console.log('Conneced');
        socket.on("chat", (payload) => {
            socket.broadcast.emit("chat", payload);
        })
        
    })





    server.listen(3000, () => console.log('Server is listening at port 3000'))