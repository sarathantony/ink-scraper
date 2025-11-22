const Result = require('../models/results.model');

exports.getResultByReleaseId = async (req, res) => {
  try {
    const releaseId = Number(req.params.release_id);

    if (Number.isNaN(releaseId)) {
      return res.status(400).json({ message: "Invalid release_id" });
    }

    const record = await Result.findOne({ release_id: releaseId });

    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.status(200).json(record);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
