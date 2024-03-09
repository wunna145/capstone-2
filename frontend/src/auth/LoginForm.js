/**
 * Component for user login form.
 * @module LoginForm
 */

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../common/Alert";
import MusicApi from "../api/api";
import UserContext from "./UserContext";

/**
 * Functional component representing the LoginForm module.
 * @function
 * @returns {JSX.Element} JSX representing the LoginForm component.
 */
function LoginForm() {
  // Hooks for state and context
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState([]);

  /**
   * Handles form submission.
   * @param {Object} evt - The form submission event.
   */
  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      let result = await MusicApi.login(formData);
      if (result) {
        setFormErrors([]);
        updateUser({ name: formData.username });
        localStorage.setItem("currentUser", JSON.stringify(formData.username));
        const redirectPath = localStorage.getItem("redirectPath");
        if (redirectPath) {
          localStorage.removeItem("redirectPath");
          navigate(redirectPath);
        } else {
          navigate('/');
        }
      }
    } catch (e) {
      setFormErrors(["Invalid username/password"]);
      console.error(e);
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

  // Render the LoginForm component
  return (
    <div className="LoginForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h3 className="mb-3">Log In</h3>

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
                  autoComplete="username"
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  style={{ marginBottom: "10px" }}
                  onChange={handleChange}
                  autoComplete="current-password"
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
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the LoginForm component for use in other parts of the application
export default LoginForm;
