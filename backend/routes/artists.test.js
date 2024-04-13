const request = require('supertest');
const express = require('express');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const router = require('./artists');
const Artist = require('../models/artist');

jest.mock('jsonschema');
jest.mock('../models/artist');

describe('Artist Routes', () => {
  describe('GET /artists', () => {
    it('should respond with JSON containing the retrieved artists', async () => {
      // Mock data
      const mockArtists = [{ id: 1, name: 'Artist 1' }, { id: 2, name: 'Artist 2' }];
      Artist.findAll.mockResolvedValue(mockArtists);

      // Mock jsonschema validation to return valid
      jsonschema.validate.mockImplementation(() => ({ valid: true }));

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ artists: mockArtists });
      expect(Artist.findAll).toHaveBeenCalled();
    });

    it('should respond with 400 error if request parameters are invalid', async () => {
      // Mock jsonschema validation to return invalid
      jsonschema.validate.mockImplementation(() => ({ valid: false, errors: ['Invalid parameter'] }));

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/');

      // Assertions
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /artists/:name', () => {
    it('should respond with JSON containing information about the specified artist', async () => {
      // Mock data
      const mockArtist = { id: 1, name: 'Artist 1' };
      Artist.get.mockResolvedValue(mockArtist);

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/Artist_1');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ artist: mockArtist });
      expect(Artist.get).toHaveBeenCalledWith('Artist 1');
    });

    it('should handle errors if the specified artist does not exist', async () => {
      // Mock Artist.get to throw an error
      const errorMsg = 'Artist not found';
      Artist.get.mockRejectedValue(new Error(errorMsg));

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/Nonexistent_Artist');

      // Assertions
      expect(response.statusCode).toBe(500);
    });
  });
});

