/**
 * Custom error classes for handling HTTP errors in the Express application.
 * @module expressError
 */

/**
 * Generic custom error class that extends the standard JavaScript Error class.
 * @class
 */
class ExpressError extends Error {
  /**
   * Creates an instance of ExpressError.
   * @param {string} message - The error message.
   * @param {number} status - The HTTP status code associated with the error.
   */
  constructor(message, status) {
    super();
    this.message = message;
    this.status = status;
  }
}

/**
 * Custom error class representing a 404 NOT FOUND error.
 * @class
 * @extends ExpressError
 */
class NotFoundError extends ExpressError {
  /**
   * Creates an instance of NotFoundError.
   * @param {string} [message="Not Found"] - The error message.
   */
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

/**
 * Custom error class representing a 401 UNAUTHORIZED error.
 * @class
 * @extends ExpressError
 */
class UnauthorizedError extends ExpressError {
  /**
   * Creates an instance of UnauthorizedError.
   * @param {string} [message="Unauthorized"] - The error message.
   */
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

/**
 * Custom error class representing a 400 BAD REQUEST error.
 * @class
 * @extends ExpressError
 */
class BadRequestError extends ExpressError {
  /**
   * Creates an instance of BadRequestError.
   * @param {string} [message="Bad Request"] - The error message.
   */
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

/**
 * Custom error class representing a 403 FORBIDDEN error.
 * @class
 * @extends ExpressError
 */
class ForbiddenError extends ExpressError {
  /**
   * Creates an instance of ForbiddenError.
   * @param {string} [message="Forbidden"] - The error message.
   */
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// Export custom error classes for use in other parts of the application
module.exports = {
  ExpressError,
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
  ForbiddenError,
};
