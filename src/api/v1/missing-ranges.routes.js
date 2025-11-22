const express = require('express');

const router = express.Router();

const { getMissingReleaseIdRanges } = require('../../controllers/missing-ranges.controller');

router.get('/missing-ranges', getMissingReleaseIdRanges);

module.exports = router;
