var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

var {validateLogindb} = require('../controllers/logincontroller.js')
router.post('/',validateLogindb);


module.exports = router;