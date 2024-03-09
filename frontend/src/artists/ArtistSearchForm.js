/**
 * Component for searching and displaying artist details.
 * @module ArtistSearchForm
 */

import React, { useState } from "react";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import ArtistDetail from "./ArtistDetail";

/**
 * Functional component representing the ArtistSearchForm module.
 * @function
 * @returns {JSX.Element} JSX representing the ArtistSearchForm component.
 */
function ArtistSearchForm() {
  // State to hold form data and errors
  const [formData, setFormData] = useState({
    name: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [artist, setArtist] = useState(null);

  /**
   * Handles form submission.
   * @param {Object} evt - The form submission event.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await MusicApi.getArtist(formData.name);
    if (result) {
      setFormErrors([]);
      setArtist(result);
    } else {
      setFormErrors([`No artist: ${formData.name}`]);
    }
  }

  /**
   * Updates the form data field on input change.
   * @param {Object} evt - The input change event.
   */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  // Render the ArtistSearchForm component
  return (
    <div className="ArtistSearchForm">
      {!artist &&
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4"
          style={{ marginBottom: '40px' }}>
          <h3 className="mb-3">Search Artist</h3>
          <div className="card">
            <div className="card-body" style={{ backgroundColor: '#ADD8E6' }}>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label style={{ marginBottom: "10px" }}>Artist Name</label>
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
      {artist && <ArtistDetail name={artist.name} />}
    </div>
  );
}

// Export the ArtistSearchForm component for use in other parts of the application
export default ArtistSearchForm;
