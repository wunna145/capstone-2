"use strict";

/**
 * Module representing the Artist class and related database operations.
 * @module Artist
 */

const db = require("../db");
const fetchAndInsert = require("../helpers/fetchAndInsertData");

/**
 * Represents an Artist class with static methods for database operations.
 * @class
 */
class Artist {

  /**
   * Retrieve all artists from the database.
   *
   * @static
   * @async
   * @function findAll
   * @returns {Array} An array of artist objects.
   * @throws {Error} If there's an issue with the database query.
   */
  static async findAll() {
    // Construct the SQL query to select all artists from the 'artists' table
    let query = `SELECT * FROM artists`;

    // Order the results by artist name
    query += " ORDER BY name";

    // Execute the query and return the resulting rows
    const artistsRes = await db.query(query);
    return artistsRes.rows;
  }

  /**
   * Retrieve an artist by name. If the artist does not exist, fetch and insert the data into the database.
   *
   * @static
   * @async
   * @function get
   * @param {string} name - The name of the artist.
   * @returns {Object} An artist object.
   * @throws {Error} If there's an issue with the database query.
   */
  static async get(name) {
    // Query the 'artists' table to check if the artist exists
    const artistRes = await db.query(
      `SELECT *
       FROM artists
       WHERE name ILIKE $1`,
      [name]);

    const artist = artistRes.rows[0];

    // If the artist does not exist, fetch and insert the artist data
    if (!artist) {
      await fetchAndInsert('artists', name);
      
      // Query the updated 'artists' table to get the inserted artist
      const updatedArtistRes = await db.query(
        `SELECT *
         FROM artists
         WHERE name ILIKE $1`,
        [name]
      );
      
      return updatedArtistRes.rows[0];
    } else {
      // Return the existing artist
      return artist;
    }
  }
}

// Export the Artist class
module.exports = Artist;
