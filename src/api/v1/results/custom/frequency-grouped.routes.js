const express = require("express");

const router = express.Router();
const {
  getHistoricalDateAnalysis,
  getHistoricalDateAnalysisWithParams,
} = require("../../../../controllers/results/custom/frequency-grouped.controller");

router.get("/historical-date-analysis", getHistoricalDateAnalysis);
router.get(
  "/historical-date-analysis/with-params",
  getHistoricalDateAnalysisWithParams
);

module.exports = router;
