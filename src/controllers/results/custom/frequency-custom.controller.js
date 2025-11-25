const Result = require('../../../models/results.model');

const { buildPrizedList } = require('../../../utils/common.utils');
const { buildFullRangeFrequencies } = require('../../../utils/frequency.utils');
const { PRIZE_FIELDS, allowedTypes } = require('../../../constants/app.constants');
const { parseDMY } = require('../../../utils/common.utils');

exports.getTimedFrequencies = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      filterBy,
      filterDuration,
      sort
    } = req.body;

    const now = new Date();
    let rangeStart = null;
    let rangeEnd = now;

    // Validate scenario inputs
    const hasRange = startDate && endDate;
    const hasFilter = filterBy && filterDuration;

    if (!hasRange && !hasFilter) {
      return res.status(400).json({
        message: "Provide either (startDate & endDate) OR (filterBy & filterDuration)"
      });
    }

    if (hasRange && hasFilter) {
      return res.status(400).json({
        message: "Provide EITHER a date range OR a filter range, not both"
      });
    }

    // Scenario A — Use startDate & endDate
    if (hasRange) {
      const sd = parseDMY(startDate);
      const ed = parseDMY(endDate);

      if (!sd || !ed) {
        return res.status(400).json({ message: "Invalid date format (dd/mm/yyyy expected)" });
      }

      if (sd > ed) {
        return res.status(400).json({ message: "startDate cannot be greater than endDate" });
      }

      rangeStart = sd;
      rangeEnd = ed;
    }

    // Scenario B — Compute dynamic range using filterBy & filterDuration
    if (hasFilter) {
      const normalized = filterBy.replace(/s$/, '');

      if (!allowedTypes.includes(normalized)) {
        return res.status(400).json({
          message: "Invalid filterBy. Use day | month | week | year"
        });
      }

      const duration = Number(filterDuration);
      if (Number.isNaN(duration) || duration <= 0) {
        return res.status(400).json({ message: "filterDuration must be a positive number" });
      }

      rangeStart = new Date(now);

      if (normalized === 'day') {
        rangeStart.setDate(now.getDate() - duration);
      }
      if (normalized === 'week') {
        rangeStart.setDate(now.getDate() - (duration * 7));
      }
      if (normalized === 'month') {
        rangeStart.setMonth(now.getMonth() - duration);
      }
      if (normalized === 'year') {
        rangeStart.setFullYear(now.getFullYear() - duration);
      }
    }

    // Load documents
    const docs = await Result.find({}, [...PRIZE_FIELDS, 'date'].join(' ')).lean();

    const filtered = docs.filter(d => {
      if (!d.date) return false;
      const dt = parseDMY(d.date);
      return dt >= rangeStart && dt <= rangeEnd;
    });

    // Build frequencies
    const frequencies = buildPrizedList();
    const finalCounts = buildFullRangeFrequencies(filtered, PRIZE_FIELDS, frequencies);

    const cleaned = {};
    for (const [key, val] of Object.entries(finalCounts)) {
      if (val !== 0) cleaned[key] = val;
    }

    let output = cleaned;

    if (sort) {
      const grouped = {};

      for (const [numStr, count] of Object.entries(cleaned)) {
        if (!grouped[count]) grouped[count] = [];
        grouped[count].push(numStr);
      }

      // sort numbers inside each group
      for (const key of Object.keys(grouped)) grouped[key].sort();

      output = grouped;
    }

    return res.json({
      range: hasRange
        ? { type: "custom-date-range", startDate, endDate }
        : { type: filterBy, duration: filterDuration },
      totalDocsInRange: filtered.length,
      frequencies: output
    });

  } catch (err) {
    console.error('getTimedFrequencies error:', err);
    return res.status(500).json({ message: err.message });
  }
};

