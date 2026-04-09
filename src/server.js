// Load environment variables from .env.local in development
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line global-require
  require("dotenv").config({ path: ".env.local" });
}

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 8000;

// connect to MongoDB first
connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Set a longer timeout for the server (e.g., 10 minutes)
server.setTimeout(600000);
