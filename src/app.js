const express = require("express");

const app = express();
app.use(express.json());

// Default route
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// Health check route
app.get("/health", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

/*********************** GET Routes ***********************/

/**
 * Get the latest, oldest, or a specific number of records based on the filterBy query parameter.
 *
 * Example: /api/v1/release?filterBy=latest
 * Example: /api/v1/release?filterBy=oldest
 * Example: /api/v1/release?filterBy=size&size=10 - Get latest 10 records
 */
app.use("/api/v1/release", require("./api/v1/results/head-or-tail.routes"));

/**
 * GET /api/v1/release/missing-ranges - Get missing release id ranges
 *
 * Some results are missing due to cancelled publications due to COVID-19 and various other reasons.
 * These missing release ids as batches(continuous release ids) has to be accounted as they were missing.
 */
app.use("/api/v1/release", require("./api/v1/range/missing-ranges.routes"));

/**
 * GET /api/v1/release/:release_id - Get a specific result by release_id
 *
 * Example: /api/v1/release/RELEASE_ID - Get the result with release_id (75088)
 */
app.use("/api/v1/release", require("./api/v1/results/result-by-id.routes"));

/**
 * GET /api/v1/result/frequency/historical - Get historical frequency data based on type and value.
 * Fetch the historical frequency of each numbers (0000-9999). <ie, how many times each number has appeared in the results.>
 * You will be able to understand how many times each number has appeared in the results historically.
 *
 * @TODO: Add optional query params for further filtering.
 * For example, fetch the historical frequency of a particular series(KR, SS etc).
 *
 * Example: /api/v1/result/frequency/historical
 */
app.use(
  "/api/v1/result/frequency",
  require("./api/v1/frequency/frequency-historical.routes"),
);

/**
 * GET /api/v1/result/frequency - Get custom frequency data based on filter criteria.
 *
 * Params: startDate, endDate, filterBy, filterDuration, sort
 * Fetch the frequency of each number (0000-9999) based on the provided filters. <ie, how many times each number has appeared in the results for the specified filters.>
 *
 * Example: /api/v1/result/frequency?startDate=2023/01/01&endDate=2023/01/07 - Get frequency of numbers for all results that were published between 1st Jan 2023 and 7th Jan 2023.
 * Example: /api/v1/result/frequency?filterBy=month&filterDuration=3 - Get frequency of numbers for results published in the last 3 months.
 * Example: /api/v1/result/frequency?filterBy=week&filterDuration=2&sort=true - Sort the entire result. <ie, {0000: 10, 0001: 5, ..., 9999: 2}>. By default, the result is sorted by number (0000-9999) and not by frequency.
 */
app.use(
  "/api/v1/result/frequency",
  require("./api/v1/results/custom/frequency-custom.routes"),
);

/**
 * GET /api/v1/result/grouped - Get grouped frequency based on a filter criteria.
 * <DERIVE THIS TO A USEFUL FEATURE IN THE FUTURE.
 *  THIS IS CURRENTLY NOT USED AND IS JUST A PROOF OF CONCEPT FOR GROUPING THE FREQUENCY DATA BASED ON A FILTER CRITERIA.>
 *
 * Params: startDate, endDate, filterBy, filterDuration, sort
 * Fetch the frequency of each number (0000-9999) based on the provided filters and group them accordingly.
 */
app.use(
  "/api/v1/result/grouped",
  require("./api/v1/results/custom/frequency-grouped.routes"),
);

/*********************** POST Routes ***********************/

/**
 * POST /api/v1/result/add
 *
 * Add a new result to the database. Fetches the last updated release id from the database and adds the new result with the next release id.
 * <ie, if the last updated release id is 75088, it will add the new result with release id 75089>.
 */
app.use("/api/v1/result", require("./api/v1/add/add-result.routes"));

/**
 * POST /api/v1/result/add/historical
 *
 * Add historical results to the database. Fetches the last updated release id from the database and adds results with the next release id until it reaches the median release id.
 * <ie, if the last updated release id is 75088 and the median release id is 75000, it will add results with release ids 75089, 75090, ..., 75000>.
 *
 * Use with caution as it may take a long time to complete depending on the number of records to be added and the response time of the external API.
 * THIS IS VERY RARELY USED AND SHOULD BE USED WITH CAUTION AS IT MAY CAUSE PERFORMANCE ISSUES OR TIMEOUTS IF THE NUMBER OF RECORDS TO BE ADDED IS LARGE OR IF THE EXTERNAL API RESPONSE TIME IS SLOW.
 */
app.use(
  "/api/v1/result/add",
  require("./api/v1/add/add-historical-result.routes"),
);

/**
 * POST /api/v1/result/add/historical
 * <THIS FEATURE CAN BE REMOVED AFTER VALIDATING LATER. THIS WAS ADDED FOR THE INITIAL DATA POPULATION.>
 *
 * Add results from a historical breakpoint to the median release id.
 */
app.use(
  "/api/v1/result/add/historical",
  require("./api/v1/add/add-from-breakpoint-result.routes"),
);

/*********************** UPDATE Routes ***********************/

/**
 * GET /api/v1/results/update-result - Refetch and update all results in the database.
 *
 * This route is used to refetch and update all results in the database. It fetches the release ids of all records in the database and refetches the results for each release id. If the refetching is successful, it updates the record with the new data.
 * <THIS IS RARELY AND CAUTIOUSLY USED TO UPDATE THE RESULTS WHEN THERE IS A STRUCTURAL CHANGES IN THE DATA BEING SAVED.
 * ie, when we want to add a new field to the results.>
 */
app.use(
  "/api/v1/results",
  require("./api/v1/results/custom/refetch/update-result.routes"),
);

module.exports = app;
