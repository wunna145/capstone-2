"use strict";

/**
 * Module representing the Album class and related database operations.
 * @module Album
 */

const db = require("../db");
const fetchAndInsert = require("../helpers/fetchAndInsertData");

/**
 * Represents an Album class with static methods for database operations.
 * @class
 */
class Album {
  /**
   * Retrieve all albums from the database.
   *
   * @static
   * @async
   * @function findAll
   * @returns {Array} An array of album objects.
   * @throws {Error} If there's an issue with the database query.
   */
  static async findAll() {
    // Construct the SQL query to select all albums from the 'albums' table
    let query = `SELECT * FROM albums`;
    
    // Order the results by album name
    query += " ORDER BY name";

    // Execute the query and return the resulting rows
    const albumsRes = await db.query(query);
    return albumsRes.rows;
  }

  /**
   * Retrieve an album by artist name and album name.
   * If the album or artist does not exist, fetch and insert the data into the database.
   *
   * @static
   * @async
   * @function get
   * @param {string} artistName - The name of the artist.
   * @param {string} albumName - The name of the album.
   * @returns {Object} An album object.
   * @throws {Error} If there's an issue with the database query.
   */
  static async get(artistName, albumName) {
    // Query the 'artists' table to check if the artist exists
    const artistRes = await db.query(
      `SELECT *
       FROM artists
       WHERE name ILIKE $1`,
      [artistName]
    );

    const artist = artistRes.rows[0];

    // If the artist does not exist, fetch and insert the artist data
    if (!artist) {
      await fetchAndInsert('artists', artistName);
    }

    // Query the 'albums' table to check if the album exists for the given artist
    const albumRes = await db.query(
      `SELECT *
       FROM albums
       WHERE name ILIKE $1 AND artist_name ILIKE $2`,
      [albumName, artistName]
    );

    const album = albumRes.rows[0];

    // If the album does not exist, fetch and insert the album data
    if (!album) {
      await fetchAndInsert('albums', albumName);
      
      // Query the updated 'albums' table to get the inserted album
      const updatedAlbumRes = await db.query(
        `SELECT *
         FROM albums
         WHERE name ILIKE $1 AND artist_name ILIKE $2`,
        [albumName, artistName]
      );
      
      return updatedAlbumRes.rows[0];
    } else {
      // Return the existing album
      return album;
    }
  }
}

// Export the Album class
module.exports = Album;
