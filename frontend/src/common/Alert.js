import React from "react";

/**
 * React component to display alert messages.
 * @component
 * @param {Object} props - React component properties.
 * @param {string} [props.type="danger"] - Type of the alert (e.g., "danger", "success").
 * @param {Array|string} [props.messages=[]] - Array of error messages or a single error message string.
 * @returns {JSX.Element} JSX element representing the Alert component.
 */
function Alert({ type = "danger", messages = [] }) {
  // Debugging information
  console.debug("Alert", "type=", type, "messages=", messages);

  // Convert messages to an array if it's not already
  const errorMessages = Array.isArray(messages) ? messages : [messages];

  // Render the alert component
  return (
    <div className={`alert alert-${type}`} role="alert">
      {errorMessages.map((error, index) => (
        <p className="mb-0 small" key={index}>
          {error}
        </p>
      ))}
    </div>
  );
}

// Export the Alert component for use in other parts of the application
export default Alert;
