const Result = require('../../../models/results.model');

const { buildPrizedList } = require('../../../utils/common.utils');
const { buildFullRangeFrequencies } = require('../../../utils/frequency.utils');
const { PRIZE_FIELDS, allowedTypes } = require('../../../constants/app.constants');
const { parseDMY } = require('../../../utils/common.utils');

exports.getTimedFrequencies = async (req, res) => {
  try {
    const { type, value } = req.params;
    const num = Number(value);

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid type. Use day|month|year|week' });
    }

    if (Number.isNaN(num) || num <= 0) {
      return res.status(400).json({ message: 'Value must be positive number' });
    }

    // Normalize types (weeks become 'week')
    const normalized = type.replace(/s$/, ''); // days → day, months → month, weeks → week

    // Build date range
    const now = new Date();
    let startDate = new Date(now);

    if (normalized === 'day') {
      startDate.setDate(now.getDate() - num);
    }

    if (normalized === 'week') {
      startDate.setDate(now.getDate() - (num * 7));
    }

    if (normalized === 'month') {
      startDate.setMonth(now.getMonth() - num);
    }

    if (normalized === 'year') {
      startDate.setFullYear(now.getFullYear() - num);
    }

    // Load documents
    const docs = await Result.find({}, [...PRIZE_FIELDS, 'date'].join(' ')).lean();

    // Filter by date
    const filtered = docs.filter((d) => {
      if (!d.date) return false;

      const dt = parseDMY(d.date);
      return dt >= startDate && dt <= now;
    });

    // Build frequencies
    const frequencies = buildPrizedList();

    const finalCounts = buildFullRangeFrequencies(filtered, PRIZE_FIELDS, frequencies);

    // Remove zero-value keys
    const cleaned = {};
    for (const [key, value] of Object.entries(finalCounts)) {
      if (value !== 0) cleaned[key] = value;
    }

    res.json({
      range: { type: normalized, value: num },
      totalDocsInRange: filtered.length,
      frequencies: cleaned
    });

  } catch (err) {
    console.error('getTimedFrequencies error:', err);
    res.status(500).json({ message: err.message });
  }
};
