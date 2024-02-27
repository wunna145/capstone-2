import React, { useState } from "react";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import AlbumDetail from "./AlbumDetail";

function AlbumSearchForm() {
  const [formData, setFormData] = useState({
    artistName: "",
    name: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [album, setAlbum] = useState(null);

  async function handleSubmit(evt) {
    evt.preventDefault();
    console.log(formData.name);
    let result = await MusicApi.getAlbum(formData.artistName, formData.name);
    if (result) {
      setFormErrors([]);
      console.log(result);
      setAlbum(result);
    } else {
      setFormErrors([`No album: ${formData.name}`]);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <div className="AlbumSearchForm">
      {!album &&
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4"
          style={{ marginBottom: '40px' }}>
          <h3 className="mb-3">Search Album</h3>
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
                </div>

                <label style={{ marginBottom: "10px" }}>Album Name</label>
                  <input
                    name="name"
                    className="form-control"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ marginBottom: "10px" }}
                    autoComplete="name"
                    required
                  />

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
      {album && <AlbumDetail artistName={album.artist_name} name={album.name} />}
    </div>
  );
}

export default AlbumSearchForm;
