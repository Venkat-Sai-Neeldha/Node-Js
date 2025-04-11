const User = require('../models/usermodel.js');

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;
   if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: 'All fields are required.' })};  
  try {
     const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {     
     return res.status(409).json({ error: 'User already exists with this email.' });
    }
     const newUser = await User.create({name, email,password, phone });
    return res.status(201).json({  message: 'User registered successfully!',
      user: {        name: newUser.name,
        email: newUser.email,        phone: newUser.phone
      }    });
  } catch (err) {
    console.error('Registration error:', err);   
     return res.status(500).json({ error: 'Internal server error.' });
  }};

  
module.exports = {
  registerUser
};






















