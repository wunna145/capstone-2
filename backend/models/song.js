"use strict";

/**
 * Module representing the Song class and related database operations.
 * @module Song
 */

const db = require("../db");
const fetchAndInsert = require("../helpers/fetchAndInsertData");

/**
 * Represents a Song class with static methods for database operations.
 * @class
 */
class Song {

  /**
   * Retrieve all songs from the database.
   *
   * @static
   * @async
   * @function findAll
   * @returns {Array} An array of song objects.
   * @throws {Error} If there's an issue with the database query.
   */
  static async findAll() {
    // Construct the SQL query to select all songs from the 'songs' table
    let query = `SELECT * FROM songs`;

    // Order the results by song name
    query += " ORDER BY name";

    // Execute the query and return the resulting rows
    const songsRes = await db.query(query);
    return songsRes.rows;
  }

  /**
   * Retrieve a song by its unique identifier.
   *
   * @static
   * @async
   * @function getById
   * @param {number} songId - The unique identifier of the song.
   * @returns {Object} A song object.
   * @throws {Error} If there's an issue with the database query.
   */
  static async getById(songId){
    // Query the 'songs' table to get the song by its unique identifier
    const songRes = await db.query(
      `SELECT *
      FROM songs
      WHERE song_id = $1`,
      [songId]
    );
    return songRes.rows[0];
  }

  /**
   * Retrieve a song by artist name and song name.
   * If the song, artist, or album does not exist, fetch and insert the data into the database.
   *
   * @static
   * @async
   * @function get
   * @param {string} artistName - The name of the artist.
   * @param {string} songName - The name of the song.
   * @returns {Object} A song object.
   * @throws {Error} If there's an issue with the database query.
   */
  static async get(artistName, songName) {
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
       WHERE artist_name ILIKE $1`,
      [artistName]
    );

    const album = albumRes.rows[0];

    // If the album does not exist, fetch and insert the album data
    if (!album) {
      await fetchAndInsert('albums', artistName);
    }

    // Query the 'songs' table to check if the song exists for the given artist and album
    const songRes = await db.query(
      `SELECT *
       FROM songs
       WHERE name ILIKE $1 AND artist_name ILIKE $2`,
      [songName, artistName]
    );

    const song = songRes.rows[0];

    // If the song does not exist, fetch and insert the song data
    if (!song) {
      await fetchAndInsert('songs', artistName, songName, "");
      
      // Query the updated 'songs' table to get the inserted song
      const updatedSongRes = await db.query(
        `SELECT *
         FROM songs
         WHERE name ILIKE $1 AND artist_name ILIKE $2`,
        [songName, artistName]
      );
      
      return updatedSongRes.rows[0];
    } else {
      // Return the existing song
      return song;
    }
  }
}

// Export the Song class
module.exports = Song;
