const express = require('express');

const resultRoutes = require('./api/v1/latest-result.routes');
const addNewResultRoute = require('./api/v1/add-result.routes')

const app = express();
app.use(express.json());

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Node API');
});

// GET the latest release_id
app.use('/api/v1/id/release', resultRoutes);
// POST the new result
app.use('/api/v1/result', addNewResultRoute)

module.exports = app;
