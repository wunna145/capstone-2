const request = require('supertest');
const app = require('./app');
const { NotFoundError } = require('./expressError');
const Album = require('./models/album');

describe('App Routes', () => {
  describe('Error Handling Middleware', () => {
    it('should handle database errors', async () => {
        const errorMessage = 'Database error';
    
        // Mocking the Album.get method to throw an error
        Album.get = jest.fn().mockRejectedValue(new Error(errorMessage));
    
        // Send a request to trigger the error handling middleware
        const response = await request(app).get('/albums/Artist_1/Album_1').expect(500);
    
        // Assert that the response contains the expected error message
        expect(response.body).toEqual({ error: errorMessage });
    });

    it('should handle 404 errors', async () => {
        const response = await request(app).get('/nonexistent-route').expect(404);
    
        expect(response.body).toEqual({ error: { message: new NotFoundError().message, status: 404 } });
    });
  });
});

