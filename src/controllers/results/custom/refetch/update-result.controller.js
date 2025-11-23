const Result = require("../../../../models/results.model");

const { getResults } = require("../../../../lib/scraper");

exports.refetchAndUpdateAll = async (req, res) => {
  try {
    const allRecords = await Result.find({}, "release_id");

    if (!allRecords.length) {
      return res.status(404).json({ message: "No records found" });
    }

    let success = 0;
    let failed = 0;

    for (const record of allRecords) {
      const releaseId = record.release_id;

      try {
        const parsed = await getResults(releaseId);

        if (!parsed || !parsed.serialNumber) {
          failed++;

          console.log(`Parsing failed for release_id: ${releaseId}`);
          continue;
        }

        await Result.updateOne(
          { release_id: releaseId },
          {
            $set: {
              serialNumber: parsed.serialNumber,
              date: parsed.date,
              fiveThousand: parsed.fiveThousand,
              twoThousand: parsed.twoThousand,
              thousand: parsed.thousand,
              fiveHundred: parsed.fiveHundred,
              twoHundred: parsed.twoHundred,
              hundred: parsed.hundred,
            }
          }
        );

        success++;
        console.log(`✔ Updated release_id: ${releaseId}`);
      } catch (err) {
        failed++;
        console.error(`Error updating release_id ${releaseId}: ${err.message}`);
      }
    }

    return res.status(200).json({
      message: "Refetch & update complete",
      total: allRecords.length,
      success,
      failed,
    });

  } catch (error) {
    console.error("Error in update controller:", error);
    res.status(500).json({ message: error.message });
  }
};
