"use strict";

/**
 * Express router for handling authentication-related routes.
 * @module routes/auth
 */

const jsonschema = require("jsonschema");
const User = require("../models/user");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const { BadRequestError } = require("../expressError");

/**
 * Route to authenticate a user and generate an authentication token.
 *
 * @name POST /auth/token
 * @function
 * @memberof module:routes/auth
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {JSON} A JSON object containing the authentication token.
 * @throws {BadRequestError} If the request body parameters are invalid.
 * @async
 */

router.post("/token", async function (req, res, next) {
  try {
    // Validate request body parameters using JSON schema
    const validator = jsonschema.validate(req.body, userAuthSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Extract username and password from the request body
    const { username, password } = req.body;

    // Authenticate user and generate an authentication token
    const user = await User.authenticate(username, password);
    const token = createToken(user);

    // Return the authentication token in the response
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

// Export the router for use in other parts of the application
module.exports = router;
