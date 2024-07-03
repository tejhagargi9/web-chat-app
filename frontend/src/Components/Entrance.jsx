import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/entrance.css";

const Entrance = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const pushToRoom = () => {
    if (name.trim()) {
      localStorage.setItem("userName", name);
      navigate("/chatting");
    } else {
      alert("Please enter your name");
    }
  };

  return (
    <div className="main">
      <h1>Welcome to Convo</h1>
      <div className="innermain">
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={pushToRoom}>Enter Room</button>
      </div>
    </div>
  );
};

export default Entrance;
