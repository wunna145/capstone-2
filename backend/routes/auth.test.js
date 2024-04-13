const request = require('supertest');
const express = require('express');
const jsonschema = require('jsonschema');
const router = require('./auth');
const User = require('../models/user');
const { createToken } = require('../helpers/tokens');

jest.mock('jsonschema');
jest.mock('../models/user');
jest.mock('../helpers/tokens');

describe('Authentication Routes', () => {
  describe('POST /auth/token', () => {
    it('should respond with a JSON containing the authentication token', async () => {
      // Mock user credentials and token
      const credentials = { username: 'testuser', password: 'testpassword' };
      const mockUser = { id: 1, username: 'testuser' };
      const mockToken = 'mock.token.string';
      User.authenticate.mockResolvedValue(mockUser);
      createToken.mockReturnValue(mockToken);

      // Mock jsonschema validation to return valid
      jsonschema.validate.mockImplementation(() => ({ valid: true }));

      // Create Express app
      const app = express();
      app.use(express.json());
      app.use('/', router);

      // Send POST request
      const response = await request(app)
        .post('/token')
        .send(credentials);

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ token: mockToken });
      expect(User.authenticate).toHaveBeenCalledWith(credentials.username, credentials.password);
      expect(createToken).toHaveBeenCalledWith(mockUser);
    });

    it('should respond with 400 error if request body parameters are invalid', async () => {
      // Mock jsonschema validation to return invalid
      jsonschema.validate.mockImplementation(() => ({ valid: false, errors: ['Invalid parameter'] }));

      // Create Express app
      const app = express();
      app.use(express.json());
      app.use('/', router);

      // Send POST request
      const response = await request(app)
        .post('/token')
        .send({});

      // Assertions
      expect(response.statusCode).toBe(400);
    });

    it('should handle errors if authentication fails', async () => {
      // Mock User.authenticate to throw an error
      const errorMsg = 'Invalid credentials';
      User.authenticate.mockRejectedValue(new Error(errorMsg));

      // Mock jsonschema validation to return valid
      jsonschema.validate.mockImplementation(() => ({ valid: true }));

      // Create Express app
      const app = express();
      app.use(express.json());
      app.use('/', router);

      // Send POST request
      const response = await request(app)
        .post('/token')
        .send({ username: 'testuser', password: 'testpassword' });

      // Assertions
      expect(response.statusCode).toBe(500);
    });
  });
});
