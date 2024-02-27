import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";
import MusicApi from "../api/api";

function ProfileForm() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("currentUser");
  const currentUser = {'name': storedUser.replace(/"/g, '')};
  const [formErrors, setFormErrors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await MusicApi.getCurrentUser(currentUser.name);
        setFormData((prevData) => ({ ...prevData, ...result }));
      } catch (error) {
        setFormErrors(error);
      }
    };

    fetchData();
  }, []);
  
  const [formData, setFormData] = useState({
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  async function handleSubmit(evt) {
    evt.preventDefault();
    try{
      const updateData = {
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email
      }
      let result = await MusicApi.saveProfile(currentUser.name, updateData);
      if(result){
        setFormErrors([]);
        navigate("/");
        alert("Profile updated!");
      }
    }catch(e){
      setFormErrors(["Something went wrong!"]);
    }
  }

  /** Update form data field */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  return (
      <div className="SignupForm">
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <h2 className="mb-3">Edit profile</h2>
          <div className="card">
            <div className="card-body" style={{ backgroundColor: '#ADD8E6' }}>
              <h3>{currentUser.name}</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Password</label>
                  <input
                      type="password"
                      name="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className="form-group">
                  <label>First name</label>
                  <input
                      name="firstName"
                      className="form-control"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                  />
                </div>
                <div className="form-group">
                  <label>Last name</label>
                  <input
                      name="lastName"
                      className="form-control"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                      type="email"
                      name="email"
                      className="form-control"
                      style={{ marginBottom: "10px" }}
                      value={formData.email}
                      onChange={handleChange}
                      required
                  />
                </div>

                {formErrors.length
                    ? <Alert type="danger" messages={formErrors} />
                    : null
                }

                <button
                    type="submit"
                    className="btn btn-primary float-right"
                    onSubmit={handleSubmit}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}

export default ProfileForm;