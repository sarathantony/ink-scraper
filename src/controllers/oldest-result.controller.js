const Result = require('../models/results.model');

exports.getOldestResult = async (req, res) => {
  try {
    const oldest = await Result.findOne().sort({ release_id: 1 }).lean();

    if (!oldest) {
      return res.status(404).json({ message: "No records found" });
    }

    res.status(200).json({ data: oldest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
