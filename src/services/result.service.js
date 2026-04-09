const Result = require("../models/results.model");

const { RELEASE_ID } = require("../constants/app.constants");

/**
 * Fetches the latest release ID from the database.
 *
 * @returns Promise<number> -- Last available release ID or the initial RELEASE_ID if no records exist.
 * @throws Error if there is an issue fetching the latest release ID from the database.
 */
exports.fetchLatestReleaseId = async () => {
  const lastRecord = await Result.findOne().sort({ createdAt: -1 });

  return lastRecord ? lastRecord.release_id : RELEASE_ID;
};
