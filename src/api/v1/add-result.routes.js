const express = require('express');

const router = express.Router();
const { addResult } = require('../../controllers/add-result.controller');

router.post('/add', addResult);

module.exports = router;
