"use strict";

/**
 * Express router for handling song-related routes.
 * @module routes/songs
 */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const songSearchSchema = require("../schemas/songSearch.json");
const Song = require("../models/song");

// Create a new Express Router instance
const router = new express.Router();

/**
 * Route to retrieve a list of songs based on query parameters.
 *
 * @name GET /songs
 * @function
 * @memberof module:routes/songs
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the retrieved songs.
 * @throws {BadRequestError} If the request parameters are invalid.
 * @async
 */
router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    // Validate request parameters using JSON schema
    const validator = jsonschema.validate(q, songSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Retrieve songs based on query parameters
    const songs = await Song.findAll(q);
    return res.json({ songs });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to retrieve information about a specific song based on artist and song name.
 *
 * @name GET /songs/:artistName/:songName
 * @function
 * @memberof module:routes/songs
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing information about the specified song.
 * @throws {Error} If there's an issue with the database query or the song does not exist.
 * @async
 */
router.get("/:artistName/:songName", async function (req, res, next) {
  try {
    // Extract artistName and songName from URL parameters and replace underscores with spaces
    const artistName = req.params.artistName.replace(/_/g, ' ');
    const songName = req.params.songName.replace(/_/g, ' ');

    // Retrieve information about the specified song
    const song = await Song.get(artistName, songName);
    return res.json({ song });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to retrieve information about a specific song based on song ID.
 *
 * @name GET /songs/:songId
 * @function
 * @memberof module:routes/songs
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing information about the specified song.
 * @throws {Error} If there's an issue with the database query or the song does not exist.
 * @async
 */
router.get("/:songId", async function (req, res, next) {
  try {
    // Retrieve information about the specified song based on song ID
    const song = await Song.getById(req.params.songId);
    return res.json({ song });
  } catch (err) {
    return next(err);
  }
});

// Export the router for use in other parts of the application
module.exports = router;
