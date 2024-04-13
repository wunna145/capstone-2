/**
 * React component for displaying details of a specific album.
 * @component
 * @param {Object} props - The component's properties.
 * @param {string} props.artistName - The name of the artist associated with the album.
 * @param {string} props.name - The name of the album.
 * @returns {JSX.Element} - The rendered component.
 */

import React, { useState, useEffect } from "react";
import MusicApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import "./AlbumDetail.css";

function AlbumDetail({ artistName, name }) {
  // State to store the album details
  const [album, setAlbum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch album details from the API when component mounts or when artistName or name changes
  useEffect(() => {
    async function getAlbum() {
      try {
        const albumData = await MusicApi.getAlbum(artistName, name);
        setAlbum(albumData);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }

    getAlbum();
  }, [artistName, name]);

  // Render a loading spinner while waiting for album details to be fetched
  if (isLoading) return <LoadingSpinner />;

  // Render the album details once they are available
  return (
    <div className="AlbumDetail col-md-8 offset-md-2">
      <div className="album-info-container">
        {/* Display album thumbnail */}
        <div className="album-thumbnail">
          <img src={album.thumb} alt={album.name} />
        </div>

        {/* Display album details */}
        <div className="album-details">
          <h3>{album.name}</h3>
          <p>Artist: {album.artist_name}</p>
          <p>Year Released: {album.year_released}</p>
          <p>Style: {album.style}</p>
          <p>Genre: {album.genre}</p>
        </div>
      </div>

      {/* Display album description */}
      <div className="album-des">
        <h4>Description</h4>
        <p>{album.description}</p>
      </div>
    </div>
  );
}

// Export the AlbumDetail component for use in other parts of the application
export default AlbumDetail;
