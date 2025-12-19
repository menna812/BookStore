const express = require('express');
const router = express.Router();
const authorController = require('../controllers/author.controller');

// Public routes
router.get('/featured', authorController.getFeaturedAuthors);
router.get('/', authorController.getAllAuthors);

module.exports = router;
