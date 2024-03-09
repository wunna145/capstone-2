"use strict";

/**
 * Module responsible for starting the Express application server.
 * @module server
 */

// Import the Express application instance
const app = require("./app");

// Import the port configuration from the project's config module
const { PORT } = require("./config");

// Start the Express application server and listen on the specified port
app.listen(PORT, function () {
  console.log(`Server started on http://localhost:${PORT}`);
});
