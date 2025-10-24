const express = require('express');
const ApiResponse = require('../utils/apiResponse');

const router = express.Router();

// Placeholder store routes
router.get('/', (req, res) => {
  res.json(ApiResponse.success('Stores routes are working', []));
});

router.get('/:id', (req, res) => {
  res.json(ApiResponse.success('Get store by ID', { id: req.params.id, message: 'Not implemented yet' }));
});

router.post('/', (req, res) => {
  res.json(ApiResponse.success('Create store endpoint', { message: 'Not implemented yet' }));
});

module.exports = router;