"use strict";

/**
 * Configuration module for the project.
 * @module config
 */

// Load environment variables from a .env file
require("dotenv").config();
require("colors");
const key = require("./helpers/api_key");

// Check if the environment is set to 'test'
const testEnvironment = process.env.NODE_ENV === "test";

// Define the secret key for JWT (JSON Web Token) encryption
const SECRET_KEY = testEnvironment ? "secret-key-test" : process.env.SECRET_KEY || "secret-key-dev";

// Define the port for the server to listen on
const PORT = +process.env.PORT || 3001;

// Define the API key for external data retrieval (The AudioDB API)
const api_key = key;

/**
 * Get the database URI based on the environment.
 * @function
 * @returns {string} - The database URI.
 */
function getDatabaseUri() {
  return testEnvironment ? "postgres://localhost/musicsph_test" : process.env.DATABASE_URL || "postgres://localhost/musicsph";
}

/**
 * Get the API URL based on the table name and query parameters.
 * @function
 * @param {string} tableName - The name of the database table.
 * @param {string} artistName - The name of the artist (for search queries).
 * @param {string} [songName=''] - The name of the song (for search queries).
 * @param {string} [albumName=''] - The name of the album (for search queries).
 * @returns {Array} - An array containing the table name and the API URL.
 */
function getApiUrl(tableName, artistName, songName = '', albumName = '') {
  if (tableName === 'artists') {
    return ['artists', `https://www.theaudiodb.com/api/v1/json/${api_key}/search.php?s=${artistName}`];
  } else if (tableName === 'songs') {
    return ['track', `https://www.theaudiodb.com/api/v1/json/${api_key}/searchtrack.php?s=${artistName}&t=${songName}`];
  } else if (tableName === 'albums') {
    return ['album', `https://www.theaudiodb.com/api/v1/json/${api_key}/searchalbum.php?s=${artistName}`];
  }
}

// Define the bcrypt work factor based on the environment
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

// Display configuration details in the console
console.log("Your Project Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
console.log("Database URI:".yellow, getDatabaseUri());
console.log("---");

// Export configuration variables for use in other parts of the application
module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  getApiUrl
};
