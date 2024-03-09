import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";

/**
 * Component for rendering the navigation bar.
 * @component
 * @returns {JSX.Element} - The navigation bar containing links based on user authentication status.
 */
function Navigation() {
  // Get the current user and logout function from the UserContext
  const { currentUser, logout } = useContext(UserContext);
  console.debug("Navigation", "currentUser=", currentUser);

  // Navigation links for a logged-in user
  function loggedInNav() {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/playlist">
            Playlist
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/profile">
            Profile
          </NavLink>
        </li>
        <li>
          <Link className="nav-link" to="/" onClick={logout}>
            Logout({currentUser.name})
          </Link>
        </li>
      </ul>
    );
  }

  // Navigation links for a logged-out user
  function loggedOutNav() {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav
      className="Navigation navbar navbar-expand-md"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
    >
      <Link className="navbar-brand" to="/" style={{ marginLeft: '20px' }}>
        MusicSphere
      </Link>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/searchArtists">
            Artists
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/searchAlbums">
            Albums
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/searchSongs">
            Songs
          </NavLink>
        </li>
      </ul>
      {/* Render navigation links based on user authentication status */}
      {currentUser ? loggedInNav() : loggedOutNav()}
    </nav>
  );
}

// Export the Navigation component for use in other parts of the application
export default Navigation;
