import React, { useEffect, useState } from "react";
import "../styles/message.css";
import io from "socket.io-client";

const Chatting = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState(localStorage.getItem("userName"));
  const socket = io("http://localhost:3000");

  useEffect(() => {
    socket.on("chat", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
    const currentUsername = localStorage.getItem("userName");
    setName(currentUsername);

    return () => {
      socket.off("chat");
    };
  }, []);

  const sendChat = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msg = { name, message };
      socket.emit("chat", msg);
      setMessage("");
    }
  };

  return (
    <div className="mainContainer">
      <div className="msgContainer">
        <div className="msgNavbar">
          <img src="./public/images/comment.png" alt="" />
          <p>Convo</p>
        </div>
        <div className="msgArea">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.name === name ? "outgoing" : "incoming"}`}
            >
              <p><strong>{msg.name}</strong><br/>{msg.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={sendChat}>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="write a message"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chatting;
