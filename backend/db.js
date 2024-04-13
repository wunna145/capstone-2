const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

// Create a new PostgreSQL client instance
const db = new Client({
  connectionString: getDatabaseUri(),
  // Enable SSL in production environment, disable SSL in other environments
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Establish a connection to the PostgreSQL database
db.connect();

// Export the connected database client
module.exports = db;

if (typeof describe === 'function') {
  afterAll(async () => {
    try {
      // Close the database connection
      await db.end();
    } catch (err) {
      console.error("Error closing database connection:", err.message);
    }
  });
}