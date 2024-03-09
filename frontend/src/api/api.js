/**
 * Module for making API requests to the Music Sphere server.
 * @module MusicApi
 */

import axios from "axios";

// Base URL for API requests
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/**
 * Class representing the MusicApi module.
 * @class
 */
class MusicApi {
  /** Token for authentication */
  static token;

  /**
   * Make an API request.
   * @static
   * @param {string} endpoint - The API endpoint.
   * @param {object} data - The data to send in the request body.
   * @param {string} method - The HTTP request method (default is "get").
   * @returns {Promise} A promise that resolves to the API response data.
   * @throws {Array} An array of error messages if the API request fails.
   */
  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MusicApi.token}` };
    const params = (method === "get") ? data : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /**
   * Get the current user.
   * @static
   * @param {string} username - The username of the user.
   * @returns {Promise} A promise that resolves to the user object.
   */
  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /**
   * Get artists (filtered by name if not undefined).
   * @static
   * @returns {Promise} A promise that resolves to an array of artist objects.
   */
  static async getArtists() {
    let res = await this.request("artists");
    return res.artists;
  }

  /**
   * Get details on an artist by name.
   * @static
   * @param {string} name - The name of the artist.
   * @returns {Promise} A promise that resolves to the artist object.
   */
  static async getArtist(name) {
    let res = await this.request(`artists/${name}`);
    return res.artist;
  }

  /**
   * Get albums (filtered by title if not undefined).
   * @static
   * @returns {Promise} A promise that resolves to an array of album objects.
   */
  static async getAlbums() {
    let res = await this.request("albums");
    return res.albums;
  }

  /**
   * Get details on an album by name.
   * @static
   * @param {string} artistName - The name of the artist.
   * @param {string} name - The name of the album.
   * @returns {Promise} A promise that resolves to the album object.
   */
  static async getAlbum(artistName, name) {
    let res = await this.request(`albums/${artistName}/${name}`);
    return res.album;
  }

  /**
   * Get details on a song by name.
   * @static
   * @param {string} artistName - The name of the artist.
   * @param {string} name - The name of the song.
   * @returns {Promise} A promise that resolves to the song object.
   */
  static async getSong(artistName, name) {
    let res = await this.request(`songs/${artistName}/${name}`);
    return res.song;
  }

  /**
   * Get details on a song by ID.
   * @static
   * @param {string} songId - The ID of the song.
   * @returns {Promise} A promise that resolves to the song object.
   */
  static async getSongById(songId) {
    let res = await this.request(`songs/${songId}`);
    return res.song;
  }

  /**
   * Show playlist.
   * @static
   * @param {string} username - The username of the user.
   * @returns {Promise} A promise that resolves to an array of playlist objects.
   */
  static async getPlaylist(username) {
    let res = await this.request(`users/${username}/playlists/`);
    return res.playlist;
  }

  /**
   * Create a playlist.
   * @static
   * @param {string} username - The username of the user.
   * @param {string} song_id - The ID of the song to add to the playlist.
   */
  static async createPlaylist(username, song_id) {
    await this.request(`users/${username}/playlists/${song_id}`, {}, "post");
  }

  /**
   * Delete a playlist.
   * @static
   * @param {string} username - The username of the user.
   * @param {string} song_id - The ID of the song to remove from the playlist.
   */
  static async deletePlaylist(username, song_id) {
    await this.request(`users/${username}/playlists/${song_id}`, {}, "delete");
  }

  /**
   * Get token for login from username, password.
   * @static
   * @param {object} data - The user credentials (username and password).
   * @returns {Promise} A promise that resolves to the authentication token.
   */
  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /**
   * Signup for the site.
   * @static
   * @param {object} data - The user registration data.
   * @returns {Promise} A promise that resolves to the authentication token.
   */
  static async signup(data) {
    let res = await this.request(`users/`, data, "post");
    return res.token;
  }

  /**
   * Save user profile page.
   * @static
   * @param {string} username - The username of the user.
   * @param {object} data - The user profile data to update.
   * @returns {Promise} A promise that resolves to the updated user object.
   */
  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
}

// Export the MusicApi module for use in other parts of the application
export default MusicApi;
