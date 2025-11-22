const express = require('express');

const router = express.Router();
const { getResultByReleaseId } = require('../../controllers/result-by-release-id.controller');

// GET a specific result by release_id
router.get('/:release_id', getResultByReleaseId);

module.exports = router;
