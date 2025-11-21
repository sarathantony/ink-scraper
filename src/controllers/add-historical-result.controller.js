const Result = require("../models/results.model");

const { fetchLatestReleaseId } = require("../services/result.service");
const { getResults } = require("../lib/scraper");
const { MEDIAN_RELEASE_ID } = require("../constants/app.constants");

exports.addHistoricalRecords = async (req, res) => {
  let created = [];
  let failed = [];

  try {
    const latestReleaseId = await fetchLatestReleaseId();
    let nextReleaseId = Number(latestReleaseId) + 1;

    while (nextReleaseId <= MEDIAN_RELEASE_ID) {
      try {
        const data = await getResults(nextReleaseId);

        await Result.create({
          release_id: nextReleaseId,
          ...data,
        });

        created.push(nextReleaseId);
      } catch (error) {
        failed.push({ id: nextReleaseId, error: error.message });

        console.log("Failed for ID:", nextReleaseId, "| Reason:", error.message);
      }

      nextReleaseId++;
    }

    return res.status(201).json({
      message: "Completed processing until MEDIAN",
      createdCount: created.length,
      failedCount: failed.length,
      created,
      failed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
