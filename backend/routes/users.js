"use strict";

/**
 * Express router for handling user-related routes.
 * @module routes/users
 */

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

// Create a new Express Router instance
const router = express.Router();

/**
 * Route to register a new user.
 *
 * @name POST /users
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the registered user's information and authentication token.
 * @throws {BadRequestError} If the request body parameters are invalid.
 * @async
 */
router.post("/", async function (req, res, next) {
  try {
    // Validate request body parameters using JSON schema
    const validator = jsonschema.validate(req.body, userNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Register a new user, generate an authentication token, and return the user's information
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to retrieve a list of all users.
 *
 * @name GET /users
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the retrieved users.
 * @throws {Error} If there's an issue with the database query.
 * @async
 */
router.get("/", async function (req, res, next) {
  try {
    // Retrieve a list of all users
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to retrieve information about a specific user based on username.
 *
 * @name GET /users/:username
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing information about the specified user.
 * @throws {Error} If there's an issue with the database query or the user does not exist.
 * @async
 */
router.get("/:username", async function (req, res, next) {
  try {
    // Retrieve information about the specified user based on username
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to update information about a specific user based on username.
 *
 * @name PATCH /users/:username
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the updated information about the specified user.
 * @throws {BadRequestError} If the request body parameters are invalid.
 * @throws {Error} If there's an issue with the database query or the user does not exist.
 * @async
 */
router.patch("/:username", async function (req, res, next) {
  try {
    // Validate request body parameters using JSON schema
    const validator = jsonschema.validate(req.body, userUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Update information about the specified user based on username
    const user = await User.update(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to delete a specific user based on username.
 *
 * @name DELETE /users/:username
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object indicating the deletion of the specified user.
 * @throws {Error} If there's an issue with the database query or the user does not exist.
 * @async
 */
router.delete("/:username", async function (req, res, next) {
  try {
    // Delete the specified user based on username
    await User.remove(req.params.username);
    return res.json({ deleted: req.params.username });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to retrieve the playlist of a specific user based on username.
 *
 * @name GET /users/:username/playlists/
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the playlist of the specified user.
 * @throws {Error} If there's an issue with the database query or the user does not exist.
 * @async
 */
router.get("/:username/playlists/", async function (req, res, next) {
  try {
    // Retrieve the playlist of the specified user based on username
    const playlist = await User.getPlaylist(req.params.username);
    return res.json({ playlist });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to create a new playlist entry for a specific user based on username and song ID.
 *
 * @name POST /users/:username/playlists/:song_id
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object indicating the creation of a new playlist entry.
 * @throws {Error} If there's an issue with the database query or the user or song does not exist.
 * @async
 */
router.post("/:username/playlists/:song_id", async function (req, res, next) {
  try {
    // Extract songId from URL parameters
    const songId = req.params.song_id;

    // Create a new playlist entry for the specified user based on username and song ID
    await User.createPlaylist(req.params.username, songId);
    return res.json({ playlist_created: songId });
  } catch (err) {
    return next(err);
  }
});

/**
 * Route to delete a playlist entry for a specific user based on username and song ID.
 *
 * @name DELETE /users/:username/playlists/:song_id
 * @function
 * @memberof module:routes/users
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object indicating the deletion of a playlist entry.
 * @throws {Error} If there's an issue with the database query or the user or playlist entry does not exist.
 * @async
 */
router.delete("/:username/playlists/:song_id", async function (req, res, next) {
  try {
    // Extract songId from URL parameters
    const songId = req.params.song_id;

    // Delete the playlist entry for the specified user based on username and song ID
    await User.deletePlaylist(req.params.username, songId);
    return res.json({ playlist_deleted: songId });
  } catch (err) {
    return next(err);
  }
});

// Export the router for use in other parts of the application
module.exports = router;
