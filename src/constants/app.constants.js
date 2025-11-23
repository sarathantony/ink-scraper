const PRIZE_FIELDS = [
  'fiveThousand',
  'twoThousand',
  'thousand',
  'fiveHundred',
  'twoHundred',
  'hundred'
];

const allowedTypes = ['day', 'days', 'month', 'months', 'year', 'years', 'week', 'weeks'];

module.exports = {
  PRIZE_FIELDS,
  allowedTypes,
  RELEASE_ID: 72013, // Available first record.
  MEDIAN_RELEASE_ID: 75088, // Available last record as of Nov-20-2025.
  HISTORICAL_BREAK_POINT :74419
};
