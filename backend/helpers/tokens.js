/**
 * @fileoverview JWT Helper Module
 * @module jwtHelper
 * @description Provides a helper function for creating JSON Web Tokens (JWT).
 * @requires jsonwebtoken
 * @requires config
 */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/**
 * Creates a JSON Web Token (JWT) for the provided user object.
 *
 * @function
 * @name createToken
 * @param {Object} user - The user object containing information to be included in the token.
 * @returns {string} The generated JSON Web Token.
 * @throws {Error} If the token creation fails.
 * @example
 * const user = { username: "john_doe" };
 * const token = createToken(user);
 * console.log(token);
 */

function createToken(user) {
  let payload = {
    username: user.username
  };

  return jwt.sign(payload, SECRET_KEY);
}

module.exports = { createToken };
