const express = require('express');

const router = express.Router();
const { addHistoricalFromBreakPointRecords } = require('../../controllers/add-from-breakpoint-result.controller');

router.post('/breakpoint', addHistoricalFromBreakPointRecords);

module.exports = router;
