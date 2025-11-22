const express = require('express');

const router = express.Router();
const { addResult } = require('../../../controllers/add/add-result.controller');

router.post('/add', addResult);

module.exports = router;
