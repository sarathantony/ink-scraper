const Result = require('../models/results.model');
const { RELEASE_ID } = require('../constants/app.constants');

exports.getLatestResult = async (req, res) => {
  try {
    const lastRecord = await Result.findOne().sort({ createdAt: -1 }) || RELEASE_ID;
    res.json(lastRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
