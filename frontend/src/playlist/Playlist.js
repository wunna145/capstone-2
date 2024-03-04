import React, { useState, useEffect } from "react";
import MusicApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import CreatePlaylist from "./CreatePlaylist";

function Playlist() {
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = {'name': storedUser.replace(/"/g, '')};
  const navigate = useNavigate();
  let songArr = [];

  console.debug("Playlist");

  const [userPlaylist, setUserPlaylist] = useState([]);

  useEffect(function getPlaylistOnMount() {
    console.debug("Playlist useEffect getPlaylistOnMount");
    search();
  });

  async function search() {
    if (!storedUser) return navigate('/login');
    try {
      let playlist = await MusicApi.getPlaylist(currentUser.name);
      setUserPlaylist(playlist);
    } catch (error) {
      console.error("Error fetching playlist", error);
    }
  }
  
  if (!userPlaylist) return <LoadingSpinner />;

  Object.values(userPlaylist).map(song => {
    songArr.push(song.song_id);
  });
  
  return (
    <div>
      {userPlaylist && 
        <div className="Playlist">
          <CreatePlaylist songIds={songArr}/>
        </div>
      }
      {!userPlaylist && <p className="lead">Sorry, no results were found!</p>}
    </div>
  );
}

export default Playlist;
