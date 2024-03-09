"use strict";

/**
 * Express router for handling album-related routes.
 * @module routes/albums
 */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const albumSearchSchema = require("../schemas/albumSearch.json");
const Album = require("../models/album");

// Create a new Express Router instance
const router = new express.Router();

/**
 * Route to retrieve a list of albums based on query parameters.
 *
 * @name GET /albums
 * @function
 * @memberof module:routes/albums
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the retrieved albums.
 * @throws {BadRequestError} If the request parameters are invalid.
 * @async
 */
router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    // Validate request parameters using JSON schema
    const validator = jsonschema.validate(q, albumSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Retrieve albums based on query parameters
    const albums = await Album.findAll(q);
    return res.json({ albums });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to retrieve information about a specific album.
 *
 * @name GET /albums/:artistName/:albumName
 * @function
 * @memberof module:routes/albums
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing information about the specified album.
 * @throws {Error} If there's an issue with the database query or the album does not exist.
 * @async
 */
router.get("/:artistName/:albumName", async function (req, res, next) {
  try {
    // Extract artistName and albumName from URL parameters and replace underscores with spaces
    const artistName = req.params.artistName.replace(/_/g, ' ');
    const albumName = req.params.albumName.replace(/_/g, ' ');

    // Retrieve information about the specified album
    const album = await Album.get(artistName, albumName);
    return res.json({ album });
  } catch (err) {
    return next(err);
  }
});

// Export the router for use in other parts of the application
module.exports = router;
