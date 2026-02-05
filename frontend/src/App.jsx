// PR TEST LINE

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Wardrobe from './pages/Wardrobe'
import Profile from './pages/Profile'
import './App.css'

function App() {
  return (
    <Router>
      <AppLayout>
        <div style={{ paddingBottom: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/wardrobe" element={<Wardrobe />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <BottomNav />
      </AppLayout>
    </Router>
  )
}

export default App
