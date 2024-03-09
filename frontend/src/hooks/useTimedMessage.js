import { useRef, useState, useEffect } from "react";

/**
 * Custom React hook for displaying a timed message.
 * @function
 * @param {number} timeInMsec - The time duration in milliseconds for the message to be displayed.
 * @returns {Array} An array containing a boolean indicating whether the message is currently active and a function to toggle the message.
 */
function useTimedMessage(timeInMsec = 3000) {
  // State to manage the active status of the message
  const [active, setActive] = useState(false);

  // Ref to track whether the message has been shown to avoid multiple timeouts
  const messageShownRef = useRef(false);

  // Effect to handle showing and hiding the message
  useEffect(
    function showSavedMessage() {
      console.debug(
        "useTimedMessage useEffect showSavedMessage", "active=", active);

      // If the message is active and hasn't been shown, set a timeout to hide it
      if (active && !messageShownRef.current) {
        messageShownRef.current = true;
        setTimeout(function removeMessage() {
          setActive(false);
          messageShownRef.current = false;
        }, timeInMsec);
      }
    },
    [active, timeInMsec],
  );

  // Return the active state and the function to toggle it
  return [active, setActive];
}

// Export the useTimedMessage hook for use in other parts of the application
export default useTimedMessage;
