const Result = require("../../../models/results.model");
const { parseDMY, buildPrizedList } = require("../../../utils/common.utils");
const { buildFullRangeFrequencies } = require("../../../utils/frequency.utils");
const {
  PRIZE_FIELDS,
  oldestRecordDate,
} = require("../../../constants/app.constants");

/**
 * Helper function to format date as DD/MM/YYYY (since formatDateDMY doesn't exist)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDateDMY(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Get historical date analysis for the same calendar date across multiple years
 * @route GET /api/historical-date-analysis
 * @desc Get currency note analysis for the same date across previous years
 */
const getHistoricalDateAnalysis = async (req, res) => {
  try {
    // CUT_OFF_DATE is the oldest record available
    const CUT_OFF_DATE = parseDMY(oldestRecordDate);

    // Get today's date (using server time)
    const now = new Date();

    // Initialize response object following similar pattern as getTimedFrequencies
    const response = {
      success: true,
      today: formatDateDMY(now),
      parametersGenerated: [],
      data: [],
      missingDates: [],
      message: "",
      totalResultsFound: 0,
      historicalDatesAnalyzed: 0,
    };

    // Generate date parameters for the same calendar date across previous years
    // Go back up to 5 years or until we hit CUT_OFF_DATE
    const dateParameters = [];
    const currentYear = now.getFullYear();

    for (let year = currentYear; year >= currentYear - 5; year--) {
      // Create date with same month/day as today but different year
      const historicalDate = new Date(now);
      historicalDate.setFullYear(year);

      // Format date as DD/MM/YYYY to match your schema
      const formattedDate = formatDateDMY(historicalDate);

      // Skip if the historical date is in the future (edge case for same year)
      if (historicalDate > now) continue;

      // Stop if we've reached or passed the CUT_OFF_DATE
      if (historicalDate < CUT_OFF_DATE) break;

      dateParameters.push(formattedDate);
    }

    response.parametersGenerated = dateParameters;
    response.historicalDatesAnalyzed = dateParameters.length;

    // If no valid dates generated
    if (dateParameters.length === 0) {
      response.message =
        "No valid date parameters generated. Check CUT_OFF_DATE configuration.";
      return res.status(200).json(response);
    }

    // Query database for each date parameter - using similar field selection as getTimedFrequencies
    const queries = dateParameters.map((dateParam) =>
      Result.findOne(
        { date: dateParam },
        [...PRIZE_FIELDS, "date", "day", "release_id", "series"].join(" ")
      ).lean()
    );

    // Execute all queries in parallel for better performance
    const results = await Promise.allSettled(queries);

    // Process results
    const processedData = [];
    const allNotes = []; // Collect all notes for frequency analysis

    results.forEach((result, index) => {
      const dateParam = dateParameters[index];

      if (result.status === "fulfilled" && result.value) {
        // Data found for this date
        const data = result.value;

        // Calculate totals for each denomination (similar to your existing pattern)
        const totals = {};
        let grandTotal = 0;

        PRIZE_FIELDS.forEach((field) => {
          const count = data[field]?.length || 0;
          totals[field] = count;
          grandTotal += count;

          // Collect notes for frequency analysis if they exist
          if (data[field] && data[field].length > 0) {
            data[field].forEach((note) => {
              allNotes.push({
                note,
                field,
                date: data.date,
                release_id: data.release_id,
              });
            });
          }
        });

        processedData.push({
          date: data.date,
          day: data.day,
          release_id: data.release_id,
          series: data.series || "N/A",
          totals,
          grandTotal,
          hasData: true,
        });

        response.totalResultsFound++;
      } else {
        // No data found for this date
        response.missingDates.push(dateParam);

        processedData.push({
          date: dateParam,
          hasData: false,
          message: "No results found for this date",
        });
      }
    });

    response.data = processedData;

    // Optional: Perform frequency analysis across all collected notes
    if (allNotes.length > 0) {
      // Transform allNotes into format expected by buildFullRangeFrequencies
      const frequencyData = {};

      PRIZE_FIELDS.forEach((field) => {
        frequencyData[field] = allNotes
          .filter((note) => note.field === field)
          .map((note) => note.note);
      });

      // Build frequency counts (using similar approach as getTimedFrequencies)
      const frequencies = buildPrizedList();
      const finalCounts = buildFullRangeFrequencies(
        [frequencyData],
        PRIZE_FIELDS,
        frequencies
      );

      // Clean zero counts
      const cleanedCounts = {};
      for (const [key, val] of Object.entries(finalCounts)) {
        if (val !== 0) cleanedCounts[key] = val;
      }

      // Group by frequency for sorting (if requested via query param)
      if (req.query.sort === "frequency") {
        const groupedByFrequency = {};

        for (const [numStr, count] of Object.entries(cleanedCounts)) {
          if (!groupedByFrequency[count]) groupedByFrequency[count] = [];
          groupedByFrequency[count].push(numStr);
        }

        // Sort numbers inside each group
        for (const key of Object.keys(groupedByFrequency)) {
          groupedByFrequency[key].sort();
        }

        response.frequencyAnalysis = groupedByFrequency;
      } else {
        response.frequencyAnalysis = cleanedCounts;
      }

      response.totalNotesAnalyzed = allNotes.length;
      response.uniqueNotesCount = Object.keys(cleanedCounts).length;
    }

    // Generate appropriate message based on results
    if (response.totalResultsFound === 0) {
      response.message =
        "No historical data found for any of the generated dates.";
    } else if (response.totalResultsFound === dateParameters.length) {
      response.message = `Found data for all ${dateParameters.length} historical dates.`;
    } else {
      response.message = `Found data for ${response.totalResultsFound} out of ${dateParameters.length} historical dates.`;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error in getHistoricalDateAnalysis:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Alternative version with query parameter support
 * @route GET /api/historical-date-analysis/with-params
 * @desc Get historical analysis with optional year range and sort parameter
 */
const getHistoricalDateAnalysisWithParams = async (req, res) => {
  try {
    const { years = 5, sort, referenceDate } = req.query;

    // CUT_OFF_DATE is the oldest record available (11/07/2020)
    const CUT_OFF_DATE = parseDMY("11/07/2020");

    // Use referenceDate if provided, otherwise use today
    const reference = referenceDate ? parseDMY(referenceDate) : new Date();
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Invalid referenceDate format. Use dd/mm/yyyy",
      });
    }

    const numYears = parseInt(years);
    if (isNaN(numYears) || numYears < 1 || numYears > 10) {
      return res.status(400).json({
        success: false,
        message: "Years parameter must be a number between 1 and 10",
      });
    }

    // Generate date parameters
    const dateParameters = [];
    const currentYear = reference.getFullYear();

    for (let i = 0; i <= numYears; i++) {
      const year = currentYear - i;
      const historicalDate = new Date(reference);
      historicalDate.setFullYear(year);

      // Skip future dates
      if (historicalDate > reference) continue;

      // Stop if we've reached or passed the CUT_OFF_DATE
      if (historicalDate < CUT_OFF_DATE) break;

      dateParameters.push(formatDateDMY(historicalDate));
    }

    // Query and process results (similar to main function)
    const queries = dateParameters.map((dateParam) =>
      Result.findOne(
        { date: dateParam },
        [...PRIZE_FIELDS, "date", "day", "release_id", "series"].join(" ")
      ).lean()
    );

    const results = await Promise.allSettled(queries);
    const processedData = [];
    const allNotes = [];
    const missingDates = [];

    results.forEach((result, index) => {
      const dateParam = dateParameters[index];

      if (result.status === "fulfilled" && result.value) {
        const data = result.value;

        // Collect notes for frequency analysis
        PRIZE_FIELDS.forEach((field) => {
          if (data[field] && data[field].length > 0) {
            data[field].forEach((note) => {
              allNotes.push({ note, field, date: data.date });
            });
          }
        });

        processedData.push({
          date: data.date,
          day: data.day,
          release_id: data.release_id,
          series: data.series || "N/A",
          hasData: true,
        });
      } else {
        missingDates.push(dateParam);
        processedData.push({
          date: dateParam,
          hasData: false,
        });
      }
    });

    // Build response
    const response = {
      success: true,
      referenceDate: formatDateDMY(reference),
      yearsAnalyzed: numYears,
      parametersGenerated: dateParameters,
      data: processedData,
      missingDates,
      totalResultsFound: processedData.filter((d) => d.hasData).length,
    };

    // Add frequency analysis if notes were collected
    if (allNotes.length > 0) {
      const frequencies = buildPrizedList();
      const frequencyData = {};

      PRIZE_FIELDS.forEach((field) => {
        frequencyData[field] = allNotes
          .filter((note) => note.field === field)
          .map((note) => note.note);
      });

      const finalCounts = buildFullRangeFrequencies(
        [frequencyData],
        PRIZE_FIELDS,
        frequencies
      );
      const cleanedCounts = {};

      for (const [key, val] of Object.entries(finalCounts)) {
        if (val !== 0) cleanedCounts[key] = val;
      }

      if (sort === "frequency") {
        const grouped = {};
        for (const [numStr, count] of Object.entries(cleanedCounts)) {
          if (!grouped[count]) grouped[count] = [];
          grouped[count].push(numStr);
        }

        for (const key of Object.keys(grouped)) grouped[key].sort();
        response.frequencyAnalysis = grouped;
      } else {
        response.frequencyAnalysis = cleanedCounts;
      }
    }

    return res.json(response);
  } catch (error) {
    console.error("Error in getHistoricalDateAnalysisWithParams:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getHistoricalDateAnalysis,
  getHistoricalDateAnalysisWithParams,
};
