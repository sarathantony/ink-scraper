const Result = require('../../models/results.model');

const { fetchLatestReleaseId } = require('../../services/result.service')
const { getResults } = require('../../lib/scraper');

exports.addResult = async (req, res) => {
  try {
    const latestReleaseId = await fetchLatestReleaseId();
    const nextReleaseId = Number(latestReleaseId) + 1;
    const data = await getResults(nextReleaseId);

    const newRecord = await Result.create({
      release_id: nextReleaseId,
      ...data,
    });

    res.status(201).json({
      data: newRecord,
      message: "New record created based on latest result",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
