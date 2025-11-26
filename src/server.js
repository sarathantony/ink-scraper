if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.local" });
}

const app = require('./app');
const connectDB = require('./config/db');


const PORT = process.env.PORT || 8000;

// connect to MongoDB first
connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.setTimeout(600000);
