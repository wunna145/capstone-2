const request = require('supertest');
const express = require('express');
const jsonschema = require('jsonschema');
const router = require('./users');
const User = require('../models/user');

jest.mock('jsonschema');
jest.mock('../models/user');
jest.mock('../helpers/tokens', () => ({
  createToken: jest.fn(() => 'mockToken')
}));

describe('User Routes', () => {
  describe('POST /users', () => {
    it('should respond with a JSON containing the registered user\'s information and authentication token', async () => {
      // Mock user registration
      const mockUser = { username: 'testuser' };
      User.register.mockResolvedValue(mockUser);

      // Mock jsonschema validation to return valid
      jsonschema.validate.mockImplementation(() => ({ valid: true }));

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send POST request
      const response = await request(app).post('/').send({ username: 'testuser', password: 'testpassword' });

      // Assertions
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('user', mockUser);
      expect(response.body).toHaveProperty('token', 'mockToken');
    });

    it('should respond with 400 error if request body parameters are invalid', async () => {
      // Mock jsonschema validation to return invalid
      jsonschema.validate.mockImplementation(() => ({ valid: false, errors: ['Invalid parameter'] }));

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send POST request
      const response = await request(app).post('/').send({});

      // Assertions
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /users', () => {
    it('should respond with a JSON containing the retrieved users', async () => {
      // Mock user data
      const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
      User.findAll.mockResolvedValue(mockUsers);

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('users', mockUsers);
      expect(User.findAll).toHaveBeenCalled();
    });
  });
});

