import React from "react";

function Alert({ type = "danger", messages = [] }) {
  console.debug("Alert", "type=", type, "messages=", messages);

  const errorMessages = Array.isArray(messages) ? messages : [messages];

  return (
      <div className={`alert alert-${type}`} role="alert">
        {errorMessages.map(error => (
            <p className="mb-0 small" key={error}>
              {error}
            </p>
        ))}
      </div>
  );
}

export default Alert;
