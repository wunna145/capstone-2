import React from "react";
import './Alert.css';

/**
 * React component to display alert messages.
 * @component
 * @param {Object} props - React component properties.
 * @returns {JSX.Element} JSX element representing the Alert component.
 */
function Alert({ type = "danger", messages = [] }) {
  // Debugging information
  console.debug("Alert", "type=", type, "messages=", messages);

  // Convert messages to an array if it's not already
  const errorMessages = Array.isArray(messages) ? messages : [messages];

  // Render the alert component
  return (
    <div className={`alert-card`} role="alert">
      {errorMessages.map((error, index) => (
        <p className="error-msg" key={index}>
          {error}
        </p>
      ))}
    </div>
  );
}

// Export the Alert component for use in other parts of the application
export default Alert;
