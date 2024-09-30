import React, { useEffect, useState } from "react";
import MusicApi from "../api/api";
import "./CreatePlaylist.css";
import { useNavigate } from "react-router-dom";

/**
 * Component for displaying the user's playlist and allowing navigation to song details.
 * @component
 * @param {Array} songIds - An array of song IDs in the user's playlist.
 * @returns {JSX.Element} - The user's playlist with song details.
 */
function CreatePlaylist({ songIds }) {
  // State to store the details of songs in the playlist
  const [songs, setSongs] = useState([]);

  // Navigate function for redirecting to song details page
  const navigate = useNavigate();

  // Effect to fetch details of songs in the playlist
  useEffect(() => {
    async function fetchSongs() {
      try {
        // Use Promise.all to concurrently fetch details of each song
        const songPromises = songIds.map(async (songId) => {
          const songRes = await MusicApi.getSongById(songId);
          return songRes;
        });

        // Resolve all promises and set the songs state
        const resolvedSongs = await Promise.all(songPromises);
        setSongs(resolvedSongs);
      } catch (error) {
        console.error("Error fetching songs", error);
      }
    }

    // Fetch songs when the component mounts or when the songIds array changes
    fetchSongs();
  }, [songIds]);

  // Function to handle navigation to song details page
  const handleClick = (song) => {
    navigate(`/songDetail/${song.artist_name}/${song.name}`);
  };

  return (
    <div className="CreatePlaylist col-md-8 offset-md-2">
      <h3 style={{ marginBottom: '25px' }}>Your playlist</h3>
      {songs.length > 0 ? (
        <div className="playlist-info-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
        </div>
      ) : (
        <p>You haven't added any song to the playlist yet.</p>
      )}
    </div>
  );
}

// Export the CreatePlaylist component for use in other parts of the application
export default CreatePlaylist;
