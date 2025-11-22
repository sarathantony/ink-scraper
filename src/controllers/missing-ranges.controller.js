const Result = require("../models/results.model");

const { findMissingRanges } = require("../utils/missing-ranges.util");

exports.getMissingReleaseIdRanges = async (req, res) => {
    try {
    const all = await Result.find({}, { release_id: 1 })
      .sort({ release_id: 1 })
      .lean();

    const ids = all.map(item => item.release_id);

    const missingRanges = findMissingRanges(ids);

    res.json({
      missingRanges,
      count: missingRanges.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error computing missing ranges' });
  }
};
