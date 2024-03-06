import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import Routes from "./routes-nav/Routes";
import LoadingSpinner from "./common/LoadingSpinner";
import MusicsphApi from "./api/api";
import UserProvider from "./auth/UserProvider";
import UserContext from "./auth/UserContext";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "musicsph-token";

const jwt = require('jsonwebtoken');

function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [playlistIds, setPlaylistIds] = useState(new Set([]));
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const { updateUser } = useContext(UserContext);

  console.debug(
      "App",
      "infoLoaded=", infoLoaded,
      "currentUser=", currentUser,
      "token=", token,
  );

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          // put the token on the Api class so it can use it to call the API.
          MusicsphApi.token = token;
          let currentUser = await MusicsphApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setPlaylistIds(new Set(currentUser.playlists));
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  function logout() {
    updateUser(null);
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setToken(null);
  }

  async function signup(signupData) {
    try {
      let token = await MusicsphApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await MusicsphApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  function hasAddedToPlaylist(song_id) {
    return playlistIds.has(song_id);
  }

  function createPlaylist(song_id) {
    if (hasAddedToPlaylist(song_id)) return;
    MusicsphApi.createPlaylist(currentUser.username, song_id);
    setPlaylistIds(new Set([...playlistIds, song_id]));
  }

  if (!infoLoaded) return <LoadingSpinner />;

  return (
      <BrowserRouter>
        <UserProvider
            value={{ currentUser, setCurrentUser, hasAddedToPlaylist, createPlaylist }}>
          <div className="App">
            <Navigation logout={logout} />
            <Routes login={login} signup={signup} />
          </div>
        </UserProvider>
      </BrowserRouter>
  );
}

export default App;
