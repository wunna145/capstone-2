/**
 * Component for user signup form.
 * @module SignupForm
 */

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import UserContext from "./UserContext";

/**
 * Functional component representing the SignupForm module.
 * @function
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.signup - The signup function.
 * @returns {JSX.Element} JSX representing the SignupForm component.
 */
function SignupForm({ signup }) {
  // Hooks for state and context
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  /**
   * Handles form submission.
   * @param {Object} evt - The form submission event.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      let result = await MusicApi.signup(formData);
      if (result) {
        updateUser({ name: formData.username });
        localStorage.setItem("currentUser", JSON.stringify(formData.username));
        setFormErrors([]);
        navigate("/");
      }
    } catch (e) {
      setFormErrors(["User already exists!"]);
      console.error(e);
    }
  }

  /**
   * Updates the form data field on input change.
   * @param {Object} evt - The input change event.
   */
  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData(data => ({ ...data, [name]: value }));
  }

  // Render the SignupForm component
  return (
    <div className="SignupForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h2 className="mb-3">Sign Up</h2>
        <div className="card">
          <div className="card-body" style={{ backgroundColor: '#ADD8E6' }}>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>First name</label>
                <input
                  name="firstName"
                  className="form-control"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Last name</label>
                <input
                  name="lastName"
                  className="form-control"
                  value={formData.lastName}
                  onChange={handleChange}
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
                />
              </div>

              {formErrors.length ? (
                <Alert type="danger" messages={formErrors} />
              ) : null}

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

// Export the SignupForm component for use in other parts of the application
export default SignupForm;
