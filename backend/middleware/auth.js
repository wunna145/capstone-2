"use strict";

/**
 * Middleware module for handling authentication in routes.
 * @module authMiddleware
 */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/**
 * Middleware: Authenticate user.
 *
 * If a token was provided, verify it, and, if valid, store the token payload
 * on res.locals.
 *
 * It's not an error if no token was provided or if the token is not valid.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} Express middleware function.
 * @throws {UnauthorizedError} If authentication fails.
 */
function authenticateJWT(req, res, next) {
  try {
    // Extract authorization header from request
    const authHeader = req.headers && req.headers.authorization;

    // If authorization header exists, extract and verify the JWT token
    if (authHeader) {
      const token = authHeader.replace(/^[Bb]earer /, "").trim();
      res.locals.user = jwt.verify(token, SECRET_KEY);
    }

    // Continue to the next middleware or route handler
    return next();
  } catch (err) {
    // Continue to the next middleware or route handler even if authentication fails
    return next();
  }
}

/**
 * Middleware to use when users must be logged in.
 *
 * If not, raises UnauthorizedError.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {Function} Express middleware function.
 * @throws {UnauthorizedError} If user is not authenticated.
 */
function ensureLoggedIn(req, res, next) {
  try {
    // If user is not present in res.locals, raise UnauthorizedError
    if (!res.locals.user) throw new UnauthorizedError();

    // Continue to the next middleware or route handler
    return next();
  } catch (err) {
    // Pass the error to the next middleware or error handler
    return next(err);
  }
}

// Export the middleware functions
module.exports = {
  authenticateJWT,
  ensureLoggedIn
};
