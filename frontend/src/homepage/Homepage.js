import React, { useEffect } from "react";
import "./Homepage.css";
import { Link } from "react-router-dom";
import MusicApi from "../api/api";

/**
 * React component for the homepage.
 * @component
 * @returns {JSX.Element} JSX element representing the Homepage component.
 */

function Homepage() {

  // useEffect(() => {
  //   searchRecentArtist();
  // }, []);
  
  // async function searchRecentArtist() {
  //   try {
  //     // Fetch the user's playlist
  //     let playlist = await MusicApi.getPlaylist(currentUser.name);
  //     // Set the user's playlist in state
  //     setUserPlaylist(playlist);
  //   } catch (error) {
  //     console.error("Error fetching playlist", error);
  //   }
  // }

  // Render the homepage content
  return (
    <div className="Homepage">
      <div className="container text-center">
        <h1 className="mb-4 font-weight-bold">MusicSphere</h1>
        <p className="lead">Harmony Awaits in MusicSphere.</p>

        <div className="button-container">
          <Link className="searchBtn" to="/searchArtists">Artists</Link>
          <Link className="searchBtn" to="/searchAlbums">Albums</Link>
          <Link className="searchBtn" to="/searchSongs" >Songs</Link>
        </div>

        <p className="recent">Most recent added to MusicSphere</p>

        {/* <div className="recent-container">
          {songs.map((song) => (
            <div key={song.id} className="playlist-details-container"
              onClick={() => handleClick(song)}
            >
              <div className="playlist-thumbnail" style={{ marginBottom: '10px' }}>
                <img src={song.thumb} alt={song.name} />
              </div>
              <p className="card-info">Title: {song.name}</p>
              <p className="card-info"> Artist: {song.artist_name} </p>
            </div>
          ))}
        </div> */}

      </div>
    </div>
  );
}

// Export the Homepage component for use in other parts of the application
export default Homepage;
