import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Welcome() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/welcome', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data.user && response.data.user.email) {
          setUserEmail(response.data.user.email);
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="con">
      <h2>Welcome!</h2>
      <p>Logged in as: {userEmail}</p>
      
    </div>
  );
}

export default Welcome;
