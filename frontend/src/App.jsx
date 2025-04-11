import React, { useEffect } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import Loginpage from './components/Loginpage'
import Register from './components/Register'
import Welcome from './components/Welcome'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  useEffect(() => {
    const handleTabClose = () => {
      localStorage.removeItem('token');
    };

    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Loginpage/>}/>
        <Route path='/' element={<Register/>}/>
        <Route 
          path='/welcome' 
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App



