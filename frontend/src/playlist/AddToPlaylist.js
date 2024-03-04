import React, { useContext, useEffect, useState } from "react";
import UserContext from "../auth/UserContext";
import MusicApi from "../api/api";
import { useNavigate } from "react-router-dom";

function AddToPlaylist({ songId }) {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isInPlaylist, setIsInPlaylist] = useState(false);

  useEffect(() => {
    const checkPlaylist = async () => {
      try {
        let playlistRes = await MusicApi.getPlaylist(currentUser.name);
        setIsInPlaylist(playlistRes.some(list => list.song_id === songId));
      } catch (error) {
        console.error("Error checking playlist", error);
      }
    };
  
    if (currentUser) {
      checkPlaylist();
    }
  });

  const handleAddToPlaylist = async () => {
    if (!currentUser) {
        localStorage.setItem("redirectPath", window.location.pathname);
        navigate("/login");
        return;
    }

    try {
      await MusicApi.createPlaylist(currentUser.name, songId);
      alert("Song added to playlist successfully!");
      setIsInPlaylist(true);
    } catch (error) {
      console.error("Error adding song to playlist", error);
      alert("Error adding song to playlist. Please try again.");
    }
  };

  const handleRemoveFromPlaylist = async () => {
    if (!currentUser) return navigate('/login');

    try {
      await MusicApi.deletePlaylist(currentUser.name, songId);
      navigate('/playlist');
      setIsInPlaylist(false);
    } catch (error) {
      console.error("Error removing song from playlist", error);
      navigate('/playlist');
    }
  };

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

export default AddToPlaylist;
