"use strict";

/**
 * Express router for handling artist-related routes.
 * @module routes/artists
 */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const artistSearchSchema = require("../schemas/artistSearch.json");
const Artist = require("../models/artist");

// Create a new Express Router instance
const router = new express.Router();

/**
 * Route to retrieve a list of artists based on query parameters.
 *
 * @name GET /artists
 * @function
 * @memberof module:routes/artists
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the retrieved artists.
 * @throws {BadRequestError} If the request parameters are invalid.
 * @async
 */
router.get("/", async function (req, res, next) {
  const q = req.query;

  try {
    // Validate request parameters using JSON schema
    const validator = jsonschema.validate(q, artistSearchSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Retrieve artists based on query parameters
    const artists = await Artist.findAll(q);
    return res.json({ artists });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to retrieve information about a specific artist.
 *
 * @name GET /artists/:name
 * @function
 * @memberof module:routes/artists
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing information about the specified artist.
 * @throws {Error} If there's an issue with the database query or the artist does not exist.
 * @async
 */
router.get("/:name", async function (req, res, next) {
  try {
    // Extract artistName from URL parameters and replace underscores with spaces
    const artistName = req.params.name.replace(/_/g, ' ');

    // Retrieve information about the specified artist
    const artist = await Artist.get(artistName);
    return res.json({ artist });
  } catch (err) {
    return next(err);
  }
});

// Export the router for use in other parts of the application
module.exports = router;
