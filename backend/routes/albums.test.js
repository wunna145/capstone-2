const request = require('supertest');
const express = require('express');
const router = require('../routes/albums');
const Album = require('../models/album');
const { NotFoundError } = require('../expressError');

jest.mock('../models/album');
jest.mock("jsonschema");

describe('GET /albums', () => {
    it('should respond with JSON containing albums', async () => {
        const mockAlbums = [{ id: 1, name: 'Album 1' }, { id: 2, name: 'Album 2' }];
        Album.findAll.mockResolvedValue(mockAlbums);
      
        const jsonschema = require('jsonschema');
        jsonschema.validate.mockImplementation(() => ({ valid: true }));
      
        const app = express();
        app.use('/', router);
      
        const response = await request(app).get('/');
        console.log(response.body);
      
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ albums: mockAlbums });
        expect(Album.findAll).toHaveBeenCalled();
      });
      

    it("should respond with 400 error if request parameters are invalid", async () => {
        const invalidQuery = { invalidParam: "value" };
        const errorMsg = "Invalid request parameters";

        const jsonschema = require("jsonschema");
        jsonschema.validate.mockImplementation(() => ({
        valid: false,
        errors: [{ stack: errorMsg }],
        }));

        const app = express();
        app.use("/", router);

        const response = await request(app).get("/").query(invalidQuery);

        expect(response.statusCode).toBe(400);
  });
  
});

describe('GET /albums/:artistName/:albumName', () => {
  it('should respond with JSON containing information about the specified album', async () => {
    const mockAlbum = { id: 1, name: 'Album 1', artistName: 'Artist 1' };
    Album.get.mockResolvedValue(mockAlbum);

    const app = express();
    app.use('/', router);

    const response = await request(app).get('/Artist_1/Album_1');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ album: mockAlbum });
    expect(Album.get).toHaveBeenCalledWith('Artist 1', 'Album 1');
  });

  it('should respond with 500 error if there is an issue with the database query', async () => {
    const errorMsg = 'Database error';
    Album.get.mockRejectedValue(new Error(errorMsg));

    const app = express();
    app.use('/', router);

    const response = await request(app).get('/Artist_1/Album_1');

    expect(response.statusCode).toBe(500);
  });

  it('should respond with 404 error if the album does not exist', async () => {
    const errorMsg = 'Album not found';
    Album.get.mockRejectedValue(new NotFoundError(errorMsg));

    const app = express();
    app.use('/', router);

    const response = await request(app).get('/Artist_1/Album_1');

    expect(response.statusCode).toBe(404);
  });
});
