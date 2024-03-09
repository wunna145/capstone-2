import React, { useState } from "react";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import SongDetail from "./SongDetail";

/**
 * Component for searching and displaying detailed information about a song.
 * @component
 * @returns {JSX.Element} - The SongSearchForm component.
 */
function SongSearchForm() {
  // State to manage form data, form errors, and the fetched song details
  const [formData, setFormData] = useState({
    artistName: "",
    name: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [song, setSong] = useState(null);

  /**
   * Handles form submission by making an API call to fetch song details.
   * @async
   * @function
   * @param {Object} evt - The event object.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      // Fetch song details based on artist name and track name
      let result = await MusicApi.getSong(formData.artistName, formData.name);

      if (result) {
        setFormErrors([]);
        setSong(result);
      } else {
        setFormErrors([`No song: ${formData.name}`]);
      }
    } catch (error) {
      console.error("Error fetching song details", error);
    }
  }
  
  /**
   * Handles changes in form input fields.
   * @function
   * @param {Object} evt - The event object.
   */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  // Rendering the SongSearchForm component
  return (
    <div className="SongSearchForm">
      {/* Display the search form if song details are not available */}
      {!song &&
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4"
          style={{ marginBottom: '40px' }}>
          <h3 className="mb-3">Search Track</h3>
          <div className="card">
            <div className="card-body" style={{ backgroundColor: '#ADD8E6' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label style={{ marginBottom: "10px" }}>Artist Name</label>
                  <input
                    name="artistName"
                    className="form-control"
                    value={formData.artistName}
                    onChange={handleChange}
                    style={{ marginBottom: "10px" }}
                    autoComplete="artistName"
                    required
                  />
                  <label style={{ marginBottom: "10px" }}>Track Name</label>
                  <input
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ marginBottom: "10px" }}
                    autoComplete="name"
                    required
                  />
                </div>

                {formErrors.length ? (
                  <Alert type="danger" messages={formErrors} />
                ) : null}

                <button
                  className="btn btn-primary float-right"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      }
      {/* Display the SongDetail component if song details are available */}
      {song && <SongDetail artistName={song.artist_name} name={song.name} />}
    </div>
  );
}

// Export the SongSearchForm component for use in other parts of the application
export default SongSearchForm;
