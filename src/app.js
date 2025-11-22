const express = require('express');

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
app.use('/api/v1/release', require('./api/v1/latest-result.routes'));
// Oldest(based on release_id) data result.
app.use('/api/v1/release', require('./api/v1/oldest-result.routes'));
// Fetch missing release id ranges.
app.use('/api/v1/release', require('./api/v1/missing-ranges.routes'));
// Fetch the data based on release id.
app.use('/api/v1/release', require('./api/v1/result-by-id.routes'));
// Historical frequency data.
app.use('/api/v1/result/frequency', require('./api/v1/frequency-historical.routes'));

/**
 * POST Routes
 */

// Add new Data.
app.use('/api/v1/result', require('./api/v1/add-result.routes'));
// Add historical Data. :- Use with caution
app.use('/api/v1/result/add', require('./api/v1/add-historical-result.routes'));
// Add from historical break point to median release id. :- Use with caution
app.use('/api/v1/result/add/historical', require('./api/v1/add-from-breakpoint-result.routes'));

module.exports = app;
