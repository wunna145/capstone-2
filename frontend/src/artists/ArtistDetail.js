/**
 * Component for displaying detailed information about an artist.
 * @module ArtistDetail
 */

import React, { useState, useEffect } from "react";
import MusicApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import "./ArtistDetail.css";

/**
 * Functional component representing the ArtistDetail module.
 * @function
 * @param {Object} props - The component's input properties.
 * @param {string} props.name - The name of the artist to display details for.
 * @returns {JSX.Element} JSX representing the ArtistDetail component.
 */
function ArtistDetail({ name }) {
  // State to hold artist details
  const [artist, setArtist] = useState(null);

  // Fetch artist details when the component mounts
  useEffect(() => {
    async function getArtist() {
      setArtist(await MusicApi.getArtist(name));
    }

    getArtist();
  }, [name]);

  // Display loading spinner while fetching data
  if (!artist) return <LoadingSpinner />;

  // Render artist details
  return (
    <div className="ArtistDetail col-md-8 offset-md-2">
      <div className="artist-info-container">
        <div className="artist-thumbnail">
          <img src={artist.thumb} alt={artist.name} />
        </div>
        <div className="artist-details">
          <h3>{artist.name}</h3>
          <p>Genre: {artist.genre}</p>
          <p>Gender: {artist.gender}</p>
          <p>Borned year: {artist.born_year}</p>
          <p>Died year: {artist.died_year}</p>
        </div>
        <div className="artist-details" style={{ marginTop: '10px' }}>
          <p>Label: {artist.label}</p>
          <p>Formed year: {artist.formed_year}</p>
          <p>Disbanded year: {artist.disbanded_year}</p>
          <p>Style: {artist.style}</p>
          <p>Mood: {artist.mood}</p>
        </div>
      </div>
      <div className="artist-details" style={{ marginLeft: '5px' }}>
        <p> {artist.country} &nbsp;&nbsp;&nbsp;
            Website: <a href={`https://${artist.website}`} 
                target="_blank" rel="noopener noreferrer">
                {artist.website} </a>
            &nbsp;&nbsp;&nbsp;
            Facebook: <a href={`https://${artist.facebook}`} 
                target="_blank" rel="noopener noreferrer">
                {artist.facebook} </a>
        </p>
      </div>
      <div className="artist-logo">
          <img src={artist.logo} alt={artist.logo} />
      </div>
      <div className="artist-images">
          <img src={artist.art1} alt={artist.art1} />
          <img src={artist.art2} alt={artist.art2} />
          <img src={artist.art3} alt={artist.art3} />
      </div>
      <div className="artist-bio">
        <h4>Biography</h4>
        <p>{artist.bio}</p>
      </div>
    </div>
  );
}

// Export the ArtistDetail component for use in other parts of the application
export default ArtistDetail;
