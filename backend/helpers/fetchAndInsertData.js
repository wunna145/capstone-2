const axios = require('axios');
const { Client } = require('pg');
const config = require('../config');
const { NotFoundError } = require("../expressError");

console.log('Database Connection Details:', config.getDatabaseUri());

/**
 * Fetches data from the specified API endpoint using Axios.
 *
 * @param {string} apiEndpoint - The API endpoint URL.
 * @returns {Promise<Object>} - A promise resolving to the response data.
 * @throws {Error} - If an error occurs during the API request.
 */

async function fetchDataFromAPI(apiEndpoint) {
  try {
    const response = await axios.get(apiEndpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API:', error.message);
    throw error;
  }
}

/**
 * Inserts data into the specified database table.
 *
 * @param {Object[]} data - An array of data objects to insert.
 * @param {string} tableName - The name of the database table.
 * @param {Object} dbClient - The PostgreSQL client instance.
 * @throws {Error} - If an error occurs during the database operation.
 */

async function insertDataIntoDatabase(data, tableName, dbClient) {
  let mappedData;

  try {
    await dbClient.connect();

    for (const item of data) {
        if(tableName === 'artists'){
            mappedData = {
                artist_id: item.idArtist,
                name: item.strArtist,
                label: item.strLabel,
                formed_year: item.intFormedYear,
                born_year: item.intBornYear,
                died_year: item.intDiedYear,
                disbanded_year: item.strDisbanded,
                style: item.strStyle,
                genre: item.strGenre,
                mood: item.strMood,
                website: item.strWebsite,
                facebook: item.strFacebook,
                bio: item.strBiographyEN,
                gender: item.strGender,
                country: item.strCountry,
                thumb: item.strArtistThumb,
                logo: item.strArtistLogo,
                art1: item.strArtistFanart,
                art2: item.strArtistFanart2,
                art3: item.strArtistFanart3,
                art4: item.strArtistFanart4
            };
        }else if(tableName === 'songs'){
            mappedData = {
                song_id: item.idTrack,
                name: item.strTrack,
                title: item.strTrack,
                album_id: item.idAlbum,
                album_name: item.strAlbum,
                artist_id: item.idArtist,
                artist_name: item.strArtist,
                description: item.strDescriptionEN,
                genre: item.strGenre,
                mood: item.strMood,
                style: item.strStyle,
                theme: item.strTheme,
                thumb: item.strTrackThumb,
                video: item.strMusicVid,
                director: item.strMusicVidDirector,
                mvcompany: item.strMusicVidCompany,
                ss1: item.strMusicVidScreen1,
                ss2: item.strMusicVidScreen2,
                ss3: item.strMusicVidScreen3
            };
        }else if(tableName === 'albums'){
            mappedData = {
                album_id: item.idAlbum,
                artist_id: item.idArtist,
                name: item.strAlbum,
                artist_name: item.strArtist,
                year_released: item.intYearReleased,
                style: item.strStyle,
                genre: item.strGenre,
                thumb: item.strAlbumThumb,
                description: item.strDescriptionEN
            };
        }

        const columns = Object.keys(mappedData);
        const values = Object.values(mappedData);

        const insertQuery = `
            INSERT INTO ${tableName} (${columns.join(', ')})
            VALUES (${values.map((_, index) => `$${index + 1}`).join(', ')})
            ON CONFLICT DO NOTHING;
        `;

        await dbClient.query(insertQuery, values);
    }

    console.log(`Data inserted into the ${tableName} table successfully`);
  } catch (error) {
    console.error(`Error inserting data into the ${tableName} table:`, error.message, mappedData);
  } finally {
    await dbClient.end();
  }
}
/**
 * Fetches data from the API and inserts it into the database.
 *
 * @param {string} tableName - The name of the database table.
 * @param {string} artistName - The name of the artist (for API query).
 * @param {string} [songName=''] - The name of the song (for API query).
 * @param {string} [albumName=''] - The name of the album (for API query).
 * @throws {NotFoundError} - If no data is found in the API response.
 * @throws {Error} - If an error occurs during the process.
 */

async function fetchAndInsert(tableName, artistName, songName = '', albumName = '') {
  const dbClient = new Client(config.getDatabaseUri());  
  try {
      const [obj, apiUrl] = config.getApiUrl(tableName, artistName, songName, albumName);
      const apiData = await fetchDataFromAPI(apiUrl);
  
      if (apiData && Array.isArray(apiData[obj])) {
        await insertDataIntoDatabase(apiData[obj], tableName, dbClient);
      } else {
        throw new NotFoundError(`No data`);
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    } finally {
      await dbClient.end();
    }
  }
  
  
module.exports = fetchAndInsert;
