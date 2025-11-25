const express = require('express');

const router = express.Router();
const { getResultByFilter } = require('../../../controllers/results/result-filter.controller');

router.get('/', getResultByFilter);

module.exports = router;
