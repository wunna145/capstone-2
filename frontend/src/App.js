import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import UserRoutes from "./routes-nav/Routes";
import Homepage from "./homepage/Homepage";
import MusicsphApi from "./api/api";
import UserProvider from "./auth/UserProvider";
import UserContext from "./auth/UserContext";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "musicsph-token";

const jwt = require('jsonwebtoken');

/**
 * Main App component serving as the entry point for the application.
 * @component
 * @returns {JSX.Element} - The App component.
 */
function App() {
  // State to manage whether user information has been loaded
  const [infoLoaded, setInfoLoaded] = useState(false);
  // State to manage current user information
  const [currentUser, setCurrentUser] = useState(null);
  // State to manage playlist IDs
  const [playlistIds, setPlaylistIds] = useState(new Set([]));
  // State to manage the authentication token
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  // Destructure updateUser function from the UserContext
  const { updateUser } = useContext(UserContext);

  /**
   * Effect hook to load user information on mount or when the token changes.
   * @function
   */
  useEffect(function loadUserInfo() {
    async function getCurrentUser() {
      // Check if a valid token exists
      if (token) {
        try {
          // Decode the token to get the username
          let { username } = jwt.decode(token);
          // Set the token on the MusicsphApi class for API calls
          MusicsphApi.token = token;
          // Fetch current user information using the API
          let currentUser = await MusicsphApi.getCurrentUser(username);
          // Update the current user state
          setCurrentUser(currentUser);
          // Update the playlist IDs state
          setPlaylistIds(new Set(currentUser.playlists));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      // Set infoLoaded to true after loading user information
      setInfoLoaded(true);
    }

    // Reset infoLoaded state before fetching user information
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  /**
   * Function to handle user logout.
   * @function
   */
  function logout() {
    updateUser(null);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setToken(null);
  }

  /**
   * Function to handle user signup.
   * @async
   * @function
   * @param {Object} signupData - The user signup data.
   * @returns {Object} - Object indicating success or failure of the signup.
   */
  async function signup(signupData) {
    try {
      // Attempt to sign up the user using the API
      let token = await MusicsphApi.signup(signupData);
      // Set the authentication token
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /**
   * Function to handle user login.
   * @async
   * @function
   * @param {Object} loginData - The user login data.
   * @returns {Object} - Object indicating success or failure of the login.
   */
  async function login(loginData) {
    try {
      // Attempt to log in the user using the API
      let token = await MusicsphApi.login(loginData);
      // Set the authentication token
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  /**
   * Function to check if a song has been added to the user's playlist.
   * @function
   * @param {string} song_id - The ID of the song.
   * @returns {boolean} - Boolean indicating whether the song is in the playlist.
   */
  function hasAddedToPlaylist(song_id) {
    return playlistIds.has(song_id);
  }

  /**
   * Function to create a new playlist entry for a song in the user's playlist.
   * @function
   * @param {string} song_id - The ID of the song.
   */
  function createPlaylist(song_id) {
    // Check if the song is already in the playlist
    if (hasAddedToPlaylist(song_id)) return;
    // Add the song to the playlist using the API
    MusicsphApi.createPlaylist(currentUser.username, song_id);
    // Update the playlist IDs state
    setPlaylistIds(new Set([...playlistIds, song_id]));
  }

  // Render the App component
  return (
    <BrowserRouter>
      {/* Provide the user context to the entire application */}
      <UserProvider
        value={{ currentUser, setCurrentUser, hasAddedToPlaylist, createPlaylist }}
      >
        <div className="App">
          <Navigation logout={logout} />
          <Routes>
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
          <UserRoutes login={login} signup={signup} />
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

// Export the App component for use in other parts of the application
export default App;
