import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

class MusicApi {
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${MusicApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get artists (filtered by name if not undefined) */

  static async getArtists() {
    let res = await this.request("artists");
    return res.artists;
  }

  /** Get details on an artist by name. */

  static async getArtist(name) {
    let res = await this.request(`artists/${name}`);
    return res.artist;
  }

   /** Get albums (filtered by title if not undefined) */

   static async getAlbums() {
    let res = await this.request("albums");
    return res.albums;
  }

  /** Get details on an album by name. */

  static async getAlbum(artistName, name) {
    let res = await this.request(`albums/${artistName}/${name}`);
    return res.album;
  }

  /** Get details on a song by name. */

  static async getSong(artistName, name) {
    let res = await this.request(`songs/${artistName}/${name}`);
    return res.song;
  }

   /** Get details on a song by name. */

   static async getSongById(songId) {
    let res = await this.request(`songs/${songId}`);
    return res.song;
  }

  /** Show playlist */

  static async getPlaylist(username) {
    let res = await this.request(`users/${username}/playlists/`);
    return res.playlist;
  }

  /** Create a playlist */

  static async createPlaylist(username, song_id) {
    await this.request(`users/${username}/playlists/${song_id}`, {}, "post");
  }
  
  /** Delete a playlist */

  static async deletePlaylist(username, song_id) {
    await this.request(`users/${username}/playlists/${song_id}`, {}, "delete");
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`users/`, data, "post");
    return res.token;
  }

  /** Save user profile page. */

  static async saveProfile(username, data) {
    let res = await this.request(`users/${username}`, data, "patch");
    return res.user;
  }
  
}


export default MusicApi;
