import React, { useEffect, useRef, useState, useCallback } from "react";
import "../styles/message.css";
import io from "socket.io-client";
import debounce from "lodash.debounce";

const Chatting = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState(localStorage.getItem("userName"));
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:3000");

    socket.current.on("chat", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.current.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    const currentUsername = localStorage.getItem("userName");
    setName(currentUsername);
    socket.current.emit("join", currentUsername);

    return () => {
      socket.current.off("chat");
      socket.current.off("activeUsers");
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    debouncedScrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const debouncedScrollToBottom = useCallback(
    debounce(scrollToBottom, 100),
    []
  );

  const sendChat = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const msg = { name, message };
      setMessages((prevMessages) => [...prevMessages, msg]); // Optimistic UI update
      socket.current.emit("chat", msg);
      setMessage("");
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="mainContainer">
      <div className="msgContainer">
        <div className="msgNavbar">
          <img src="./public/images/comment.png" alt="Convo" />
          <p>Convo</p>
        </div>
        <div className="msgArea">
          <p style={{ textAlign: "center", color: "gray" }}>
            Start conversation...
          </p>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.name === name ? "outgoing" : "incoming"
              }`}
            >
              <p>
                <strong>{msg.name === name ? "You" : msg.name}</strong>
                <br />
                {msg.message} <br />
                <span>{getCurrentTime()}</span>
              </p>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
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
      <div className="activeMembers">
        <div className="header">
          <p>Active Members</p>
        </div>
        <div className="memberNames">
          {activeUsers.map((user, index) => (
            <p key={index}>{user !== name ? user : ''}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatting;
