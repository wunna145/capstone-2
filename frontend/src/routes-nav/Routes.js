import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import Playlist from "../playlist/Playlist";
import ArtistSearchForm from "../artists/ArtistSearchForm";
import SongSearchForm from "../songs/SongSearchForm";
import AlbumSearchForm from "../albums/AlbumSearchForm";
import LoginForm from "../auth/LoginForm";
import SignupForm from "../auth/SignupForm";
import SongDetail from "../songs/SongDetail";
import ProfileForm from "../profiles/ProfileForm";

/**
 * Component that defines the routes for user navigation.
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.login - The login function.
 * @param {Function} props.signup - The signup function.
 * @returns {JSX.Element} - The component containing routes for different pages.
 */
function UserRoutes({ login, signup }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `signup=${typeof signup}`,
  );

  /**
   * Component for rendering the SongDetail route.
   * @component
   * @returns {JSX.Element} - The SongDetail component with artistName and songName parameters.
   */
  function SongDetailRoute() {
    const { artistName, songName } = useParams();

    return <SongDetail artistName={artistName} name={songName} />;
  }

  return (
    <div className="pt-5">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/playlist" element={<Playlist />} />
        <Route path="/profile" element={<ProfileForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/searchArtists" element={<ArtistSearchForm />} />
        <Route path="/searchSongs" element={<SongSearchForm />} />
        <Route path="/searchAlbums" element={<AlbumSearchForm />} />
        <Route path="/songDetail/:artistName/:songName" element={<SongDetailRoute />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </div>
  );
}

// Export the UserRoutes component for use in other parts of the application
export default UserRoutes;
