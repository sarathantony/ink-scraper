const express = require('express');
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

/**
 * GET Routes
 */

// Fetch `latest` or `oldest` result.
app.use('/api/v1/release', require('./api/v1/results/head-or-tail.routes'));
// Fetch missing release id ranges.
app.use('/api/v1/release', require('./api/v1/range/missing-ranges.routes'));
// Fetch the data based on release id.
app.use('/api/v1/release', require('./api/v1/results/result-by-id.routes'));
// Historical frequency data.
app.use('/api/v1/result/frequency', require('./api/v1/frequency/frequency-historical.routes'));
// Custom frequency data based on type and value.
app.use('/api/v1/result/frequency', require('./api/v1/results/custom/frequency-custom.routes'));

/**
 * POST Routes
 */

// Add new Data.
app.use('/api/v1/result', require('./api/v1/add/add-result.routes'));
// Add historical Data. :- Use with caution
app.use('/api/v1/result/add', require('./api/v1/add/add-historical-result.routes'));
// Add from historical break point to median release id. :- Use with caution
app.use('/api/v1/result/add/historical', require('./api/v1/add/add-from-breakpoint-result.routes'));

/**
 * UPDATE Routes.
 */
app.use("/api/v1/results", require('./api/v1/results/custom/refetch/update-result.routes'));

/**
 * AUTH Routes.
 */
app.use("/api/v1/auth", require("./api/v1/auth/auth.routes"));

module.exports = app;
