// Fields for prize breakdown.
const PRIZE_FIELDS = [
  "fiveThousand",
  "twoThousand",
  "thousand",
  "fiveHundred",
  "twoHundred",
  "hundred",
];

// Allowed types for frequency analysis.
const allowedTypes = [
  "day",
  "days",
  "month",
  "months",
  "year",
  "years",
  "week",
  "weeks",
];

const oldestRecordDate = "11/07/2020";

module.exports = {
  PRIZE_FIELDS,
  allowedTypes,
  oldestRecordDate, // Available first record date.
  RELEASE_ID: 72013, // Available first record.
  /**
   * MEDIAN_RELEASE_ID: Available last record as of Apr-9-2026. This usually can be updated to the latest release id after every new release.
   * This is prevent calling the future release ids which may not be available and to stop at this junction.
   */
  MEDIAN_RELEASE_ID: 75224, // Updated at Apr-9-2026.
  /**
   * HISTORICAL_BREAK_POINT: A specific release id from which we want to start adding historical data until we reach the median release id.
   * THIS IS TO COMPENSATE FOR THE PARSED STRUCTURE DIFFRENCE IN THE EARLIER RECORDS WHICH MAY CAUSE ISSUES IN THE SCRAPING LOGIC.
   */
  HISTORICAL_BREAK_POINT: 74419,
};
