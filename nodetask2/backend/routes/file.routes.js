const express = require('express');
const router = express.Router();
const files = require('../controllers/file.controller.js');

// Create a new File
router.post('/', files.create);

// Retrieve all Files
router.get('/', files.findAll);

// Retrieve a single File with id
router.get('/:id', files.findOne);

// Update a File with id
router.put('/:id', files.update);

// Delete a File with id
router.delete('/:id', files.delete);

module.exports = router;