import { useState, useEffect } from "react";

/**
 * Custom React hook for managing state in local storage.
 * @function
 * @param {string} key - The key for the local storage item.
 * @param {any} firstValue - The initial value to be used if the key is not found in local storage.
 * @returns {Array} An array containing the state value and a function to update the state value.
 */
function useLocalStorage(key, firstValue = null) {
  // Retrieve initial value from local storage or use the provided default
  const initialValue = localStorage.getItem(key) || firstValue;

  // Set up state using the initial value
  const [item, setItem] = useState(initialValue);

  // Effect to update local storage when the state changes
  useEffect(function setKeyInLocalStorage() {
    console.debug("hooks useLocalStorage useEffect", "item=", item);

    // If the item is null, remove it from local storage; otherwise, update the value
    if (item === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, item);
    }
  }, [key, item]);

  // Return the state value and the function to update it
  return [item, setItem];
}

// Export the useLocalStorage hook for use in other parts of the application
export default useLocalStorage;
