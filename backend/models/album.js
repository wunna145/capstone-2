"use strict";

const db = require("../db");
const fetchAndInsert = require("../helpers/fetchAndInsertData");

class Album {
  static async findAll() {
    let query = `SELECT * FROM albums`;

    query += " ORDER BY name";
    const albumsRes = await db.query(query);
    return albumsRes.rows;
  }

  static async get(artistName, albumName) {
    const artistRes = await db.query(
      `SELECT *
       FROM artists
       WHERE name ILIKE $1`,
      [artistName]
    );

    const artist = artistRes.rows[0];

    if (!artist) {
      await fetchAndInsert('artists', artistName);
    }

    const albumRes = await db.query(
      `SELECT *
       FROM albums
       WHERE name ILIKE $1 AND artist_name ILIKE $2`,
      [albumName, artistName]
    );

    const album = albumRes.rows[0];

    if (!album) {
      await fetchAndInsert('albums', artistName);
      const updatedAlbumRes = await db.query(
        `SELECT *
         FROM albums
         WHERE name ILIKE $1 AND artist_name ILIKE $2`,
        [albumName, artistName]
      );
      return updatedAlbumRes.rows[0];
    } else {
      return album;
    }
  }
}

module.exports = Album;
