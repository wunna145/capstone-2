import React, { useState } from "react";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import SongDetail from "./SongDetail";

function SongSearchForm() {
  const [formData, setFormData] = useState({
    artistName: "",
    name: ""
  });
  const [formErrors, setFormErrors] = useState([]);
  const [song, setSong] = useState(null);

  async function handleSubmit(evt) {
    evt.preventDefault();
    let result = await MusicApi.getSong(formData.artistName, formData.name);
    if (result) {
      setFormErrors([]);
      console.log(result);
      setSong(result);
    } else {
      setFormErrors([`No song: ${formData.name}`]);
    }
  }
  
  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(l => ({ ...l, [name]: value }));
  }

  return (
    <div className="SongSearchForm">
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
      {song && <SongDetail artistName={song.artist_name} name={song.name} />}
    </div>
  );
}

export default SongSearchForm;
