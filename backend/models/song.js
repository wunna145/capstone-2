"use strict";

const db = require("../db");
const fetchAndInsert = require("../helpers/fetchAndInsertData");

class Song {
  static async findAll() {
    let query = `SELECT * FROM songs`;

    query += " ORDER BY name";
    const songsRes = await db.query(query);
    return songsRes.rows;
  }

  static async getById(songId){
    const songRes = await db.query(
      `SELECT *
      FROM songs
      WHERE song_id = $1`,
      [songId]
    );
    return songRes.rows[0];
  }

  static async get(artistName, songName) {
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
         WHERE artist_name ILIKE $1`,
        [artistName]
      );
  
    const album = albumRes.rows[0];
  
    if (!album) {
        await fetchAndInsert('albums', artistName);
    }

    const songRes = await db.query(
      `SELECT *
       FROM songs
       WHERE name ILIKE $1 AND artist_name ILIKE $2`,
      [songName, artistName]
    );

    const song = songRes.rows[0];

    if (!song) {
      await fetchAndInsert('songs', artistName, songName, "");
      const updatedSongRes = await db.query(
        `SELECT *
         FROM songs
         WHERE name ILIKE $1 AND artist_name ILIKE $2`,
        [songName, artistName]
      );
      return updatedSongRes.rows[0];
    } else {
      return song;
    }
  }
}

module.exports = Song;
