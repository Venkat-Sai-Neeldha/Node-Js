import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/Login.css';

function Loginpage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/login', formData);
      const token = response.data.token;
      
      if (token) {
        localStorage.setItem('token', token);
        navigate('/welcome');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Login failed');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='container'>
      <h2>Welcome to Login Page</h2>
      <div id='mail'>
        <label id='email'>Email:</label>
        <input 
          type="email" 
          name="email"
          placeholder='Enter your email'
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div id='pass'>
        <label id='password'>Password:</label>
        <input 
          type="password" 
          name="password"
          placeholder='enter your password'
          value={formData.password}
          onChange={handleChange}
        />
      </div>
      <button type='submit' onClick={handleSubmit}>
        Login
      </button>
      <h3>New to this site? <Link to="/">Register</Link></h3>
    </div>
  );
}

export default Loginpage
