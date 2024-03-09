import React, { useState, useEffect } from "react";
import MusicApi from "../api/api";
import LoadingSpinner from "../common/LoadingSpinner";
import "./SongDetail.css";
import AddToPlaylist from "../playlist/AddToPlaylist";

/**
 * Component for displaying detailed information about a song.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.artistName - The name of the artist of the song.
 * @param {string} props.name - The name of the song.
 * @returns {JSX.Element} - The SongDetail component displaying information about the song.
 */
function SongDetail({ artistName, name }) {
  const [song, setSong] = useState(null);

  useEffect(() => {
    /**
     * Fetches information about the song from the Music API.
     * @async
     * @function
     */
    async function getSong() {
      setSong(await MusicApi.getSong(artistName, name));
    }

    getSong();
  }, [artistName, name]);

  // If song information is not available, display a loading spinner
  if (!song) return <LoadingSpinner />;

  // Extracting YouTube video ID from the video URL
  let videoId;
  if (song.video != null) {
    videoId = song.video.split("v=")[1];
  }

  // Rendering the SongDetail component
  return (
    <div className="SongDetail col-md-8 offset-md-2">
      <div className="song-info-container">
        <div className="song-thumbnail">
          <img src={song.thumb} alt={song.name} />
        </div>
        <div className="song-details">
          <h3>{song.name}</h3>
          <p>Artist: {song.artist_name}</p>
          <p>Album: {song.album_name}</p>
          <p>Director: {song.director}</p>
          <p>MV Company: {song.mvcompany}</p>
        </div>
        <div className="song-details">
          <AddToPlaylist songId={song.song_id} />
          <p>Genre: {song.genre}</p>
          <p>Mood: {song.mood}</p>
          <p>Style: {song.style}</p>
          <p>Theme: {song.theme}</p>
        </div>
      </div>
      <div className="more-info">
        {/* Embedding the YouTube video using the extracted video ID */}
        <iframe
          style={{ margin: '50px' }}
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="song-images">
        <h4>Screenshots from MV</h4>
        <img src={song.ss1} alt={song.ss1} />
        <img src={song.ss2} alt={song.ss2} />
        <img src={song.ss3} alt={song.ss3} />
      </div>
      <div className="song-des">
        <h4>Description</h4>
        <p>{song.description}</p>
      </div>
    </div>
  );
}

// Export the SongDetail component for use in other parts of the application
export default SongDetail;
