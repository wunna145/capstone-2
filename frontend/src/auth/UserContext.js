import React from "react";

/**
 * React context for providing the currentUser object and a setter for it throughout the app.
 * @namespace UserContext
 * @type {Object}
 * @property {Function} Provider - The context provider component.
 * @property {Function} Consumer - The context consumer component.
 */
const UserContext = React.createContext();

// Export the UserContext for use in other parts of the application
export default UserContext;
