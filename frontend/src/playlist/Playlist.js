import React, { useState, useEffect } from "react";
import MusicApi from "../api/api";
import { useNavigate } from "react-router-dom";
import CreatePlaylist from "./CreatePlaylist";

/**
 * Component for displaying the user's playlist.
 * @component
 * @returns {JSX.Element} - The user's playlist with song details.
 */
function Playlist() {
  // Get the current user from local storage
  const storedUser = localStorage.getItem("currentUser");
  // Format the current user object
  const currentUser = { name: storedUser.replace(/"/g, '') };
  // Navigate function for redirecting to login page
  const navigate = useNavigate();
  // Array to store song IDs in the playlist
  let songArr = [];

  // State to store the user's playlist
  const [userPlaylist, setUserPlaylist] = useState([]);

  // Effect to fetch the user's playlist when the component mounts
  useEffect(() => {
    console.debug("Playlist useEffect getPlaylistOnMount");
    search();
  }, []);

  // Function to fetch the user's playlist
  async function search() {
    // Redirect to login if no user is stored in local storage
    if (!storedUser) return navigate('/login');
    try {
      // Fetch the user's playlist
      let playlist = await MusicApi.getPlaylist(currentUser.name);
      // Set the user's playlist in state
      setUserPlaylist(playlist);
    } catch (error) {
      console.error("Error fetching playlist", error);
    }
  }

  // Populate the songArr array with song IDs from the user's playlist
  if (userPlaylist) {
    Object.values(userPlaylist).map(song => {
      songArr.push(song.song_id);
    });
  }

  return (
    <div>
      {userPlaylist && 
        <div className="Playlist">
          {/* Display the user's playlist with song details */}
          <CreatePlaylist songIds={songArr}/>
        </div>
      }
      {!userPlaylist && <p className="lead">Sorry, no results were found!</p>}
    </div>
  );
}

// Export the Playlist component for use in other parts of the application
export default Playlist;
