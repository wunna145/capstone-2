const request = require('supertest');
const express = require('express');
const { BadRequestError } = require('../expressError');
const jsonschema = require('jsonschema');
const router = require('./songs');
const Song = require('../models/song');

jest.mock('jsonschema');
jest.mock('../models/song');

describe('Song Routes', () => {
  describe('GET /songs', () => {
    it('should respond with a JSON containing the retrieved songs', async () => {
      // Mock songs
      const mockSongs = [{ id: 1, name: 'Song 1' }, { id: 2, name: 'Song 2' }];
      Song.findAll.mockResolvedValue(mockSongs);

      // Mock jsonschema validation to return valid
      jsonschema.validate.mockImplementation(() => ({ valid: true }));

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ songs: mockSongs });
      expect(Song.findAll).toHaveBeenCalledWith({});
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

  describe('GET /songs/:artistName/:songName', () => {
    it('should respond with a JSON containing information about the specified song', async () => {
      // Mock song
      const mockSong = { id: 1, name: 'Song 1' };
      Song.get.mockResolvedValue(mockSong);

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/Artist_1/Song_1');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ song: mockSong });
      expect(Song.get).toHaveBeenCalledWith('Artist 1', 'Song 1');
    });
  });

  describe('GET /songs/:songId', () => {
    it('should respond with a JSON containing information about the specified song', async () => {
      // Mock song
      const mockSong = { id: 1, name: 'Song 1' };
      Song.getById.mockResolvedValue(mockSong);

      // Create Express app
      const app = express();
      app.use('/', router);

      // Send GET request
      const response = await request(app).get('/1');

      // Assertions
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({ song: mockSong });
      expect(Song.getById).toHaveBeenCalledWith('1');
    });
  });
});

