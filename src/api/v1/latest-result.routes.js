const express = require('express');

const router = express.Router();
const { getLatestResult } = require('../../controllers/latest-result.controller');

router.get('/latest', getLatestResult);

module.exports = router;
