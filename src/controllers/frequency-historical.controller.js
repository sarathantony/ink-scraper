// controllers/frequency.full.controller.js
const Result = require('../models/results.model');

const { buildFullRangeFrequencies } = require('../utils/frequency.utils');

// prize fields (explicit list keeps it safe & reusable)
const PRIZE_FIELDS = [
  'fiveThousand',
  'twoThousand',
  'thousand',
  'fiveHundred',
  'twoHundred',
  'hundred'
];

// optional query params can be added later (start/end/release ids, date filters, etc.)
exports.getFullRangeFrequencies = async (req, res) => {
  try {
    // load all docs (for 2246 documents this is fine)
    // for larger collections switch to a cursor / aggregation approach
    const docs = await Result.find({}, PRIZE_FIELDS.join(' ')).lean();

    const frequencies = buildFullRangeFrequencies(docs, PRIZE_FIELDS);

    // return counts object and some meta
    res.json({
      totalDocsConsidered: docs.length,
      frequencies
    });
  } catch (err) {
    console.error('getFullRangeFrequencies error:', err);

    res.status(500).json({ message: err.message });
  }
};
