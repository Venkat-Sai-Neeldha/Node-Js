var express = require('express');
var router = express.Router();
var {registerUser} = require('../controllers/registercontroller.js')
router.post('/',registerUser);
module.exports = router;