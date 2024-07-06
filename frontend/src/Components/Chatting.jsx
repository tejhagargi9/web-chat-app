import React, { useEffect, useRef, useState, useCallback } from "react";
import "../styles/message.css";
import io from "socket.io-client";
import debounce from "lodash.debounce";
import { images } from "../javascripts/images";

const Chatting = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const messagesEndRef = useRef(null);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("https://web-chat-app-gold.vercel.app/");

    socket.current.on("chat", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.current.on("activeUsers", (users) => {
      console.log("Active users received: ", users); 
      setActiveUsers(users);
    });

    const currentUsername = localStorage.getItem("userName");
    setName(currentUsername);
    socket.current.emit("join", currentUsername);

    return () => {
      socket.current.off("chat");
      socket.current.off("activeUsers");
      socket.current.disconnect();
      setActiveUsers([]);
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

  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes} ${ampm}`;
  };

  const sendChat = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const currentTime = getCurrentTime();
      const msg = { name, message, currentTime };
      setMessages((prevMessages) => [...prevMessages, msg]);
      socket.current.emit("chat", msg);
      setMessage("");
    }
  };
  console.log(activeUsers);

  return (
    <div className="mainContainer">
      <div className="msgContainer">
        <div className="msgNavbar">
          <img src={images.logo} alt="Convo" />
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
                <span>{msg.currentTime}</span>
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
          {activeUsers.length - 1 > 0 ? (
            activeUsers.map((user, index) => (
              <p key={index}>{user !== name ? user : ""}</p>
            ))
          ) : (
            <p>Chat room is Empty</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatting;
