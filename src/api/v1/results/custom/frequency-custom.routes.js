const express = require('express');

const router = express.Router();
const { getTimedFrequencies } = require('../../../../controllers/results/custom/frequency-custom.controller');

router.get('/:type/:value', getTimedFrequencies);

module.exports = router;
