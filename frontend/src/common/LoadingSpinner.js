import React from "react";
import ClipLoader from "react-spinners/CircleLoader";
import './LoadingSpinner.css';

/**
 * React component for a loading spinner, used by components that fetch API data.
 * @component
 * @returns {JSX.Element} JSX element representing the LoadingSpinner component.
 */
function LoadingSpinner() {
  return (
    <div className="loadingSpinner">
      <ClipLoader size={100} color={"#fff"} />
      <p>L o a d i n g . . .</p>
    </div>
  );
}

// Export the LoadingSpinner component for use in other parts of the application
export default LoadingSpinner;
