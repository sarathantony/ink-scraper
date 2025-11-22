
const express = require('express');
const router = express.Router();

const { getFullRangeFrequencies } = require('../../controllers/frequency-historical.controller');

// GET the full 0000-9999 frequency object
router.get('/historical', getFullRangeFrequencies);

module.exports = router;
