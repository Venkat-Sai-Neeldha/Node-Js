import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import React from 'react'
import FileTable from './components/FileTable'

function App() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-content">
          <h1>File Manager</h1>
        </div>
      </nav>
      <div className="main-content">
        <FileTable/>
      </div>
    </>
  )
}

export default App




