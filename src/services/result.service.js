const Result = require('../models/results.model');

const { RELEASE_ID } = require('../constants/app.constants');

exports.fetchLatestReleaseId = async () => {
  const lastRecord = await Result.findOne().sort({ createdAt: -1 });

  return lastRecord ? lastRecord.release_id : RELEASE_ID;
};
