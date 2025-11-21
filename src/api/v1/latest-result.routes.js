const express = require('express');

const router = express.Router();
const { getLatestResult } = require('../../controllers/latest-result.controller');

router.post('/latest', getLatestResult);

module.exports = router;
