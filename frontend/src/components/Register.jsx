import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styling/Register.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/register', formData);
      
      alert('Registration successful!');
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className='regcon'>
      <h2>Welcome to Register Page</h2>
      <div className='regform'>
        <label id='name'>Name</label>
        <input 
          type="text" 
          name="name"
          placeholder='Enter your name'
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className='regform'>
        <label id='email'>Email</label>
        <input 
          type="email" 
          name="email"
          placeholder='Enter your Email'
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className='regform'>
        <label id='password'>Password</label>
        <input 
          type="password" 
          name="password"
          placeholder='Enter your password'
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>
      <div className='regform'>
        <label id='mobile'>Phone</label>
        <input 
          type="tel" 
          name="phone"
          placeholder='enter your mobile number'
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>
      <button type='submit' onClick={handleSubmit}>
        Register
      </button>
      <p>Already have an account? go to <Link to="/login">Login</Link></p>
    </div>
  );
}

export default Register
