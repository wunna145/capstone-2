import React, { useState, useEffect } from "react";
import MusicApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import "./AlbumDetail.css";

function AlbumDetail({ artistName, name }) {
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    async function getAlbum() {
      setAlbum(await MusicApi.getAlbum(artistName, name));
    }

    getAlbum();
  }, [artistName, name]);

  if (!album) return <LoadingSpinner />;
 
  return (
    <div className="AlbumDetail col-md-8 offset-md-2">
      <div className="album-info-container">
        <div className="album-thumbnail">
          <img src={album.thumb} alt={album.name} />
        </div>
        <div className="album-details">
          <h3>{album.name}</h3>
          <p>Artist: {album.artist_name}</p>
          <p>Year Released: {album.year_released}</p>
          <p>Style: {album.style}</p>
          <p>Genre: {album.genre}</p>
        </div>
      </div>
      <div className="album-des">
        <h4>Description</h4>
        <p>{album.description}</p>
      </div>
    </div>
  );
}

export default AlbumDetail;
