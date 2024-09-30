import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../auth/UserContext";
import './Navigation.css';

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
          <NavLink className="link" to="/playlist">
            Playlist
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="link" to="/profile">
            Profile
          </NavLink>
        </li>
        <li>
          <Link className="link" to="/" onClick={logout}>
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
          <NavLink className="link" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="link" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    );
  }

  return (
    <nav
      className="Navigation navbar navbar-expand-md"
      style={{ backgroundColor: '#062125', marginBottom: '50px'}}
    >
      <Link className="navbar-brand" to="/" style={{ color: 'white', marginLeft: '30px' }}>
        MusicSphere
      </Link>
      <ul className="navbar-nav ml-4">
        <li className="nav-item mr-4">
          <NavLink className="link" to="/searchArtists">
            Artists
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="link" to="/searchAlbums">
            Albums
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="link" to="/searchSongs">
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
