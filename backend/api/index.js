const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*", // Allow requests from all origins
    methods: ["GET", "POST"], // Allow specific HTTP methods
    allowedHeaders: ["Content-Type"], // Allow specific headers
    credentials: true, // Allow cookies to be sent with requests
  },
});

// Use the cors middleware
app.use(cors());

let activeUsers = {};

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("Connected");

  socket.on("join", (userName) => {
    activeUsers[socket.id] = userName;
    io.emit("activeUsers", Object.values(activeUsers));
  });

  socket.on("chat", (payload) => {
    socket.broadcast.emit("chat", payload);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
    delete activeUsers[socket.id];
    io.emit("activeUsers", Object.values(activeUsers));
  });
});

server.listen(3000, () => console.log("Server is listening at port 3000"));
