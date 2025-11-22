const express = require('express');

const latestResultRoute = require('./api/v1/latest-result.routes');
const oldestResultRoute = require('./api/v1/oldest-result.routes');
const addNewResultRoute = require('./api/v1/add-result.routes');
const addHistoricalResultRoute = require('./api/v1/add-historical-result.routes');
const addFromBreakPointResultRoute = require('./api/v1/add-from-breakpoint-result.routes');
const getResultByIdRoute = require('./api/v1/result-by-id.routes');

const app = express();
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Node API');
});

/**
 * GET Routes
 */

// Latest(based on release_id) data result.
app.use('/api/v1/release', latestResultRoute);
// Oldest(based on release_id) data result.
app.use('/api/v1/release', oldestResultRoute);
// Fetch the data based on release id.
app.use('/api/v1/release', getResultByIdRoute);

/**
 * POST Routes
 */

// Add new Data.
app.use('/api/v1/result', addNewResultRoute);
// Add historical Data. :- Use with caution
app.use('/api/v1/result/add', addHistoricalResultRoute);
// Add from historical break point to median release id. :- Use with caution
app.use('/api/v1/result/add/historical', addFromBreakPointResultRoute);

module.exports = app;
