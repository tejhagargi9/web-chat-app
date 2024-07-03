import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Entrance = () => {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const pushToRoom = () => {
    if (name.trim()) {
      localStorage.setItem('userName', name)
      navigate('/chatting')
    } else {
      alert('Please enter your name')
    }
  }

  return (
    <div>
      <input 
        type="text" 
        placeholder='Enter your name' 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
      />
      <button onClick={pushToRoom}>Enter Room</button>
    </div>
  )
}

export default Entrance
