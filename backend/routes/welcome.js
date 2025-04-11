const express = require('express');
const router = express.Router();
const { islogin } = require('../controllers/logincontroller.js');

router.post('/', islogin, (req, res) => {
 
  res.json({ 
    valid: true, 
    user: {
      userId: req.user.userId,
      email: req.user.email
    } 
  });
});

module.exports = router;

