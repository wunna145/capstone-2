import React, { useState } from "react";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import ArtistDetail from "./ArtistDetail";

function ArtistSearchForm() {
  const [formData, setFormData] = useState({
    name: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [artist, setArtist] = useState(null);

  async function handleSubmit(evt) {
    evt.preventDefault();
    console.log(formData.name);
    let result = await MusicApi.getArtist(formData.name);
    if (result) {
      setFormErrors([]);
      setArtist(result);
    } else {
      setFormErrors([`No artist: ${formData.name}`]);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

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

export default ArtistSearchForm;
