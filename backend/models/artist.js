"use strict";

const db = require("../db");
const fetchAndInsert = require("../helpers/fetchAndInsertData");


class Artist {

  static async findAll() {
    let query = `SELECT * FROM artists`;

    query += " ORDER BY name";
    const artistsRes = await db.query(query);
    return artistsRes.rows;
  }

  static async get(name) {
    const artistRes = await db.query(
          `SELECT *
           FROM artists
           WHERE name ILIKE $1`,
        [name]);

    const artist = artistRes.rows[0];

    if (!artist) {
      await fetchAndInsert('artists', name);
      const updatedArtist = await db.query(
        `SELECT *
         FROM artists
         WHERE name ILIKE $1`,
      [name]);
      return updatedArtist.rows[0];
    }else{
      return artist;
    }
  }
  
}


module.exports = Artist;
