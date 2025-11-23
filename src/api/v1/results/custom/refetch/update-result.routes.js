const express = require('express');

const router = express.Router();
const { refetchAndUpdateAll } = require('../../../../../controllers/results/custom/refetch/update-result.controller');

router.get('/update-result', refetchAndUpdateAll);

module.exports = router;
