/**
 * React component for searching and displaying album details.
 * @component
 * @returns {JSX.Element} - The rendered component.
 */

import React, { useState } from "react";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import AlbumDetail from "./AlbumDetail";
import ClipLoader from "react-spinners/CircleLoader";

function AlbumSearchForm() {
  // State to store form data, form errors, and album details
  const [formData, setFormData] = useState({
    artistName: "",
    name: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle form submission
  async function handleSubmit(evt) {
    evt.preventDefault();
    setLoading(true);
    let result = await MusicApi.getAlbum(formData.artistName, formData.name);
    setLoading(false);

    // Update state based on API result
    if (result) {
      setFormErrors([]);
      setAlbum(result);
    } else {
      setFormErrors([`No album: ${formData.name}`]);
    }
  }

  // Function to update form data fields
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <div className="AlbumSearchForm">
      {/* Render search form if album details are not available */}
      {!album && (
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4" style={{ marginBottom: '40px' }}>
          <h3 className="mb-3">Search Album</h3>
          <div className="card">
            <div className="card-body" style={{ backgroundColor: '#ADD8E6' }}>
              {/* Album search form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="artistName" style={{ marginBottom: "10px" }}>Artist Name</label>
                  <input
                    id="artistName"
                    name="artistName"
                    className="form-control"
                    value={formData.artistName}
                    onChange={handleChange}
                    style={{ marginBottom: "10px" }}
                    autoComplete="artistName"
                    required
                  />
                </div>

                <label htmlFor="name" style={{ marginBottom: "10px" }}>Album Name</label>
                <input
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ marginBottom: "10px" }}
                  autoComplete="name"
                  required
                />

                {/* Display form errors, if any */}
                {formErrors.length ? (
                  <Alert type="danger" messages={formErrors} />
                ) : null}

                {/* Submit button */}
                <button
                  className="btn btn-primary float-right"
                  type="submit"
                >
                  {loading ? <ClipLoader size={20} color={"#fff"} /> : "Search"}

                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Render AlbumDetail component if album details are available */}
      {album && <AlbumDetail artistName={album.artist_name} name={album.name} />}
    </div>
  );
}

// Export the AlbumSearchForm component for use in other parts of the application
export default AlbumSearchForm;
