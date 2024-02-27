import React, { useContext } from "react";
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

function UserRoutes({ login, signup }) {
  console.debug(
    "Routes",
    `login=${typeof login}`,
    `register=${typeof register}`,
  );

function SongDetailRoute() {
  const { artistName, songName } = useParams();

  return <SongDetail artistName={artistName} name={songName} />;
}

  return (
    <div className="pt-5">
      <Routes>
        <Route path="/" element={<Homepage />} />

        <Route
          path="/playlist"
          element={<Playlist />}
        />

        <Route
          path="/profile"
          element={<ProfileForm />}
        />

        <Route path="/login"
            element={<LoginForm /> }
        />

        <Route path="/signup"
            element={<SignupForm /> }
        />

        <Route path="/searchArtists"
            element={<ArtistSearchForm /> }
        />

        <Route path="/searchSongs"
            element={<SongSearchForm /> }
        />

        <Route path="/searchAlbums"
            element={<AlbumSearchForm /> }
        />

        <Route path="/songDetail/:artistName/:songName"
            element={<SongDetailRoute />}
        />

      </Routes>
    </div>
  );
}

export default UserRoutes;
