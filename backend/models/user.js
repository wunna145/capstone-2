"use strict";

/**
 * Module representing the User class and related database operations.
 * @module User
 */

const db = require("../db");
const bcryptjs = require("bcryptjs");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");

/**
 * Represents a User class with static methods for user-related operations and database interactions.
 * @class
 */
class User {

  /**
   * Authenticate a user based on the provided username and password.
   *
   * @static
   * @async
   * @function authenticate
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Object} An object representing the authenticated user.
   * @throws {UnauthorizedError} If authentication fails.
   */
  static async authenticate(username, password) {
    const result = await db.query(
      `SELECT username,
              password,
              first_name AS "firstName",
              last_name AS "lastName",
              email
       FROM users
       WHERE username = $1`,
      [username],
    );

    const user = result.rows[0];

    if (user) {
      const isValid = await bcryptjs.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  /**
   * Register a new user with the provided user data.
   *
   * @static
   * @async
   * @function register
   * @param {Object} userData - The user data to be registered.
   * @param {string} userData.username - The username of the user.
   * @param {string} userData.password - The password of the user.
   * @param {string} userData.firstName - The first name of the user.
   * @param {string} userData.lastName - The last name of the user.
   * @param {string} userData.email - The email address of the user.
   * @returns {Object} An object representing the registered user.
   * @throws {BadRequestError} If the username is duplicate.
   */
  static async register(
    { username, password, firstName, lastName, email }) {
    const duplicateCheck = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`,
      [username],
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcryptjs.hash(password, BCRYPT_WORK_FACTOR);

    const result = await db.query(
      `INSERT INTO users
         (username,
          password,
          first_name,
          last_name,
          email
          )
         VALUES ($1, $2, $3, $4, $5)
         RETURNING username, first_name AS "firstName", last_name AS "lastName", email`,
      [
        username,
        hashedPassword,
        firstName,
        lastName,
        email,
      ],
    );

    const user = result.rows[0];

    return user;
  }

  /**
   * Retrieve all users from the database.
   *
   * @static
   * @async
   * @function findAll
   * @returns {Array} An array of user objects.
   * @throws {Error} If there's an issue with the database query.
   */
  static async findAll() {
    const result = await db.query(
      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              email
       FROM users
       ORDER BY username`,
    );

    return result.rows;
  }

  /**
   * Retrieve a user by username.
   *
   * @static
   * @async
   * @function get
   * @param {string} username - The username of the user.
   * @returns {Object} An object representing the requested user.
   * @throws {NotFoundError} If the user does not exist.
   */
  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              email
       FROM users
       WHERE username = $1`,
      [username],
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    return user;
  }

  /**
   * Update user information based on the provided username and data.
   *
   * @static
   * @async
   * @function update
   * @param {string} username - The username of the user to be updated.
   * @param {Object} data - The data to be updated for the user.
   * @param {string} data.password - The new password for the user.
   * @param {string} data.firstName - The new first name for the user.
   * @param {string} data.lastName - The new last name for the user.
   * @returns {Object} An object representing the updated user.
   * @throws {NotFoundError} If the user does not exist.
   */
  static async update(username, data) {
    if (data.password) {
      data.password = await bcryptjs.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    const { setCols, values } = sqlForPartialUpdate(
      data,
      {
        firstName: "first_name",
        lastName: "last_name"
      });
    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email`;
    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /**
   * Remove a user based on the provided username.
   *
   * @static
   * @async
   * @function remove
   * @param {string} username - The username of the user to be removed.
   * @throws {NotFoundError} If the user does not exist.
   */
  static async remove(username) {
    let result = await db.query(
      `DELETE
       FROM users
       WHERE username = $1
       RETURNING username`,
      [username],
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }

  /**
   * Create a new playlist for a user based on the provided username and songId.
   *
   * @static
   * @async
   * @function createPlaylist
   * @param {string} username - The username of the user.
   * @param {number} songId - The unique identifier of the song.
   * @throws {NotFoundError} If the song or username does not exist.
   */
  static async createPlaylist(username, songId) {
    const preCheck = await db.query(
      `SELECT song_id
       FROM songs
       WHERE song_id = $1`, [songId]);
    const song = preCheck.rows[0];

    if (!song) throw new NotFoundError(`No song: ${songId}`);

    const preCheck2 = await db.query(
      `SELECT username
       FROM users
       WHERE username = $1`, [username]);
    const user = preCheck2.rows[0];

    if (!user) throw new NotFoundError(`No username: ${username}`);

    await db.query(
      `INSERT INTO playlists (song_id, username)
       VALUES ($1, $2)`,
      [songId, username]);
  }

  /**
   * Retrieve the playlist of a user based on the provided username.
   *
   * @static
   * @async
   * @function getPlaylist
   * @param {string} username - The username of the user.
   * @returns {Array} An array of song objects representing the user's playlist.
   * @throws {NotFoundError} If the playlist does not exist.
   */
  static async getPlaylist(username) {
    let result = await db.query(
      `SELECT *
       FROM playlists
       WHERE username = $1`,
      [username],
    );
    const playlist = result.rows;

    if (!playlist) throw new NotFoundError(`No playlist: ${username}`);
    return playlist;
  }

  /**
   * Delete a song from a user's playlist based on the provided username and songId.
   *
   * @static
   * @async
   * @function deletePlaylist
   * @param {string} username - The username of the user.
   * @param {number} songId - The unique identifier of the song.
   * @throws {NotFoundError} If the playlist entry does not exist.
   */
  static async deletePlaylist(username, songId) {
    let result = await db.query(
      `DELETE
       FROM playlists
       WHERE username = $1
       AND song_id = $2`,
      [username, songId],
    );
    const playlist = result.rows[0];

    if (!playlist) throw new NotFoundError(`No playlist: ${username}: ${songId}`);
  }

}

// Export the User class
module.exports = User;
