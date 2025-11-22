const express = require('express');

const router = express.Router();
const { addHistoricalRecords } = require('../../../controllers/add/add-historical-result.controller');

router.post('/historical', addHistoricalRecords);

module.exports = router;
