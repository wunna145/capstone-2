import React, { useContext, useEffect, useState } from "react";
import UserContext from "../auth/UserContext";
import MusicApi from "../api/api";
import { useNavigate } from "react-router-dom";

/**
 * Component for adding or removing a song from the user's playlist.
 * @component
 * @param {string} songId - The unique identifier of the song to be added or removed.
 * @returns {JSX.Element} - A button to add or remove the song from the playlist.
 */
function AddToPlaylist({ songId }) {
  // Access current user information from the context
  const { currentUser } = useContext(UserContext);

  // Navigate function for redirecting after certain actions
  const navigate = useNavigate();

  // State to track whether the song is already in the playlist
  const [isInPlaylist, setIsInPlaylist] = useState(false);

  // Effect to check whether the song is in the playlist
  useEffect(() => {
    const checkPlaylist = async () => {
      try {
        // Get the user's playlist and check if the song is present
        let playlistRes = await MusicApi.getPlaylist(currentUser.name);
        setIsInPlaylist(playlistRes.some(list => list.song_id === songId));
      } catch (error) {
        console.error("Error checking playlist", error);
      }
    };

    // Check the playlist when the component mounts or when the current user changes
    if (currentUser) {
      checkPlaylist();
    }
  }, [currentUser, songId]);

  // Function to handle adding the song to the playlist
  const handleAddToPlaylist = async () => {
    // Redirect to login if the user is not logged in
    if (!currentUser) {
      localStorage.setItem("redirectPath", window.location.pathname);
      navigate("/login");
      return;
    }

    try {
      // Call the API to add the song to the playlist
      await MusicApi.createPlaylist(currentUser.name, songId);
      alert("Song added to playlist successfully!");
      setIsInPlaylist(true);
    } catch (error) {
      console.error("Error adding song to playlist", error);
      alert("Error adding song to playlist. Please try again.");
    }
  };

  // Function to handle removing the song from the playlist
  const handleRemoveFromPlaylist = async () => {
    // Redirect to login if the user is not logged in
    if (!currentUser) return navigate('/login');

    try {
      // Call the API to remove the song from the playlist
      await MusicApi.deletePlaylist(currentUser.name, songId);
      navigate('/playlist');
      setIsInPlaylist(false);
    } catch (error) {
      console.error("Error removing song from playlist", error);
      navigate('/playlist');
    }
  };

  // Determine the button text based on whether the song is in the playlist
  const buttonText = isInPlaylist ? "Remove from playlist" : "Add to playlist";

  return (
    <button
      className="btn btn-primary"
      onClick={isInPlaylist ? handleRemoveFromPlaylist : handleAddToPlaylist}
      style={{ marginBottom: '10px' }}
    >
      {buttonText}
    </button>
  );
}

// Export the AddToPlaylist component for use in other parts of the application
export default AddToPlaylist;
