const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);


const corsOptions = {
  origin: "*", // Allow requests from this origin
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));

const io = socketio(server);

// Use the cors middleware
app.use(
  cors({
    origin: "https://convowebchat.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

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
