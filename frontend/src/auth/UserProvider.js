import React, { useState, useEffect } from 'react';
import UserContext from './UserContext';

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if there's a user in localStorage
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser({'name': storedUser.replace(/"/g, '')});
    }
  }, []);

  const updateUser = (newUser) => {
    setCurrentUser(newUser);
  };

  const logout = () => {
    // Clear user information from localStorage
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  return (
    <UserContext.Provider value={{ currentUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
