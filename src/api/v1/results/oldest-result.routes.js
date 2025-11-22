const express = require('express');
const router = express.Router();

const { getOldestResult } = require('../../../controllers/results/oldest-result.controller');

router.get('/oldest', getOldestResult);

module.exports = router;
