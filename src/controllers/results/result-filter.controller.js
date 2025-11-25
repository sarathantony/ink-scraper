const Result = require('../../models/results.model');
const { RELEASE_ID } = require('../../constants/app.constants');

exports.getResultByFilter = async (req, res) => {
  try {
    const { filterBy } = req.query;

    if (!filterBy) {
      return res.status(400).json({ message: "filterBy query param is required (latest | oldest)" });
    }

    let result;

    switch (filterBy) {
      case "oldest":
        result = await Result.findOne().sort({ createdAt: -1 }) || RELEASE_ID;
        if (!result) {
          return res.status(404).json({ message: "No records found" });
        }
        return res.status(200).json({ type: "oldest", data: result });

      case "latest":
        result = await Result.findOne().sort({ createdAt: -1 }).lean();
        if (!result) {
          return res.status(404).json({ message: "No records found" });
        }
        return res.status(200).json({ type: "latest", data: result });

      default:
        return res.status(400).json({
          message: "Invalid filterBy. Use 'latest' or 'oldest'."
        });
    }

  } catch (error) {
    console.error("getResultByFilter error:", error);
    res.status(500).json({ message: error.message });
  }
};

