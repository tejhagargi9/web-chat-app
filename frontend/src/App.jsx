import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Entrance from './Components/Entrance'
import Chatting from './Components/Chatting'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Entrance />} />
        <Route path='/chatting' element={<Chatting />} />
      </Routes>
    </Router>
  )
}

export default App
