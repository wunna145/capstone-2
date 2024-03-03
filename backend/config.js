"use strict";

require("dotenv").config();
require("colors");

const testEnvironment = process.env.NODE_ENV === "test";

const SECRET_KEY = testEnvironment ? "secret-key-test" : process.env.SECRET_KEY || "secret-key-dev";
const PORT = +process.env.PORT || 3001;
const api_key = '523532';

function getDatabaseUri() {
  return testEnvironment ? "postgres://localhost/musicsph-test" : process.env.DATABASE_URL || "postgres://localhost/musicsph";
}

function getApiUrl(tableName, artistName, songName='', albumName=''){
    if(tableName === 'artists'){
      return ['artists', `https://www.theaudiodb.com/api/v1/json/${api_key}/search.php?s=${artistName}`];
    }else if(tableName === 'songs'){
      return ['track', `https://www.theaudiodb.com/api/v1/json/${api_key}/searchtrack.php?s=${artistName}&t=${songName}`];      
    }else if(tableName === 'albums'){
      return ['album', `https://www.theaudiodb.com/api/v1/json/${api_key}/searchalbum.php?s=${artistName}`];
    }
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

console.log("Your Project Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR:".yellow, BCRYPT_WORK_FACTOR);
console.log("Database URI:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
  getApiUrl
};
