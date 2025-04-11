const User = require('../models/usermodel.js');
const jwt = require('jsonwebtoken');

const validateLogindb = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    if (password === user.password) {
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        'secretkey'
      );
      
      return res.status(200).json({ 
        message: 'Login successful!', 
        token: token 
      });
    } else {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
  } catch (err) {
    console.error('Database query error: ', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

const islogin = async (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];  
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) {
        return res.status(401).json({ valid: false, message: 'Invalid or expired token' });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(500).json({ error: 'Token verification failed' });
  }
};

module.exports = {
  validateLogindb,
  islogin
  };
