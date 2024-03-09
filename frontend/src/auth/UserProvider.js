import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';

/**
 * React component that provides a UserContext provider to manage the currentUser state.
 * @component
 * @param {Object} props - React component properties.
 * @param {ReactNode} props.children - Child components that will have access to the UserContext.
 * @returns {JSX.Element} JSX element representing the UserProvider.
 */
const UserProvider = ({ children }) => {
  // State to manage the currentUser information
  const [currentUser, setCurrentUser] = useState(null);

  // useEffect to check for a user in localStorage on component mount
  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      // Set the currentUser based on the stored information
      setCurrentUser({ 'name': storedUser.replace(/"/g, '') });
    }
  }, []);

  /**
   * Function to update the currentUser state.
   * @function
   * @param {Object} newUser - The new user information.
   */
  const updateUser = (newUser) => {
    setCurrentUser(newUser);
  };

  /**
   * Function to handle user logout by clearing information from localStorage.
   * @function
   */
  const logout = () => {
    // Clear user information from localStorage
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  // Provide the UserContext with currentUser, updateUser, and logout
  return (
    <UserContext.Provider value={{ currentUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Export the UserProvider for use in other parts of the application
export default UserProvider;

