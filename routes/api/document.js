const express = require('express');
const router = express.Router(); 

// @route   GET api/document
// @desc    Test route
// @access  Public
router.get('/', (req, res) => res.send('Document route'));

module.exports = router;