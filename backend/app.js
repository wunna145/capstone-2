"use strict";

/**
 * Main application file for the server.
 * @module app
 */

const express = require("express");
const cors = require("cors");
const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const artistsRoutes = require("./routes/artists");
const albumsRoutes = require("./routes/albums");
const songsRoutes = require("./routes/songs");
const usersRoutes = require("./routes/users");

const morgan = require("morgan");

// Create an Express application
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse incoming JSON requests
app.use(express.json());

// Enable logging of HTTP requests in a concise format
app.use(morgan("tiny"));

// Middleware to authenticate users based on JWT (JSON Web Token)
app.use(authenticateJWT);

// Define routes for different parts of the application
app.use("/auth", authRoutes);
app.use("/artists", artistsRoutes);
app.use("/albums", albumsRoutes);
app.use("/songs", songsRoutes);
app.use("/users", usersRoutes);

// Error handling middleware
app.use(function (err, req, res, next) {
  // Check if the error is a database error
  if (err instanceof Error && err.message === 'Database error') {
    // Send a 500 status code with the error message
    return res.status(500).json({ error: err.message });
  }
  
  // For other errors, delegate to the default error handler
  return next(err);
});

// Handle 404 errors -- this matches everything
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  // Log the error stack if not in test environment
  if (process.env.NODE_ENV !== "test") console.error(err.stack);

  // Set HTTP status code based on the error or default to 500 (Internal Server Error)
  const status = err.status || 500;

  // Extract error message
  const message = err.message;

  // Respond with JSON containing error details
  return res.status(status).json({
    error: { message, status },
  });
});

// Export the Express application for use in other parts of the application
module.exports = app;
