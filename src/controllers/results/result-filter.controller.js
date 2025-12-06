const Result = require("../../models/results.model");
const { RELEASE_ID } = require("../../constants/app.constants");

exports.getResultByFilter = async (req, res) => {
  try {
    const { filterBy, size } = req.query;

    if (!filterBy) {
      return res.status(400).json({
        message: "filterBy query param is required (latest | oldest | size)",
      });
    }

    let result;

    switch (filterBy) {
      // Get the oldest record
      case "oldest":
        result = await Result.findOne().sort({ createdAt: -1 }) || RELEASE_ID;
        if (!result) {
          return res.status(404).json({ message: "No records found" });
        }
        return res.status(200).json({ type: "oldest", data: result });

      // Get the latest record
      case "latest":
        result = await Result.findOne().sort({ createdAt: -1 }).lean();
        if (!result) {
          return res.status(404).json({ message: "No records found" });
        }
        return res.status(200).json({ type: "latest", data: result });

      // Get latest N records
      case "size": {
        const limit = Number(size);

        if (!limit || limit <= 0) {
          return res.status(400).json({
            message:
              "A valid positive 'size' query param is required when filterBy=size",
          });
        }

        result = await Result.find({}, "_id release_id serialNumber date series day")
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();

        if (!result.length) {
          return res.status(404).json({ message: "No records found" });
        }

        return res.status(200).json({
          type: "latest-size",
          size: result.length,
          data: result,
        });
      }

      default:
        return res.status(400).json({
          message: "Invalid filter",
        });
    }
  } catch (error) {
    console.error("getResultByFilter error:", error);
    res.status(500).json({ message: error.message });
  }
};
