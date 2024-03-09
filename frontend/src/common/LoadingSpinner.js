import React from "react";
import "./LoadingSpinner.css";

/**
 * React component for a loading spinner, used by components that fetch API data.
 * @component
 * @returns {JSX.Element} JSX element representing the LoadingSpinner component.
 */
function LoadingSpinner() {
  // Render the loading spinner
  return (
    <div className="LoadingSpinner">
      Loading ...
    </div>
  );
}

// Export the LoadingSpinner component for use in other parts of the application
export default LoadingSpinner;
