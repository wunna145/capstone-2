const db = require('../db');
const fetchAndInsert = require('../helpers/fetchAndInsertData');
const Artist = require('./artist');

jest.mock('../db');
jest.mock('../helpers/fetchAndInsertData');

describe('Artist', () => {
  describe('findAll', () => {
    it('should retrieve all artists from the database', async () => {
      const mockArtists = [{ id: 1, name: 'Artist 1' }, { id: 2, name: 'Artist 2' }];
      db.query.mockResolvedValue({ rows: mockArtists });

      const artists = await Artist.findAll();

      expect(artists).toEqual(mockArtists);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database query error', async () => {
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);

      await expect(Artist.findAll()).rejects.toThrow(error);

      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('get', () => {
    it('should retrieve an artist by name', async () => {
      const artistName = 'Artist 1';
      const mockArtist = { id: 1, name: artistName };
      db.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [mockArtist] });
      fetchAndInsert.mockResolvedValue();

      const artist = await Artist.get(artistName);

      expect(artist).toEqual(mockArtist);
      expect(fetchAndInsert).toHaveBeenCalledTimes(1);
      expect(fetchAndInsert).toHaveBeenCalledWith('artists', artistName);
    });

    it('should handle database query error', async () => {
      const artistName = 'Artist 1';
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);
      fetchAndInsert.mockResolvedValue();

      await expect(Artist.get(artistName)).rejects.toThrow(error);

    });

    it('should handle existing artist', async () => {
        const artistName = 'Artist 1';
        const mockArtist = { id: 1 };
        db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }).mockResolvedValueOnce({ rows: [mockArtist] });
        fetchAndInsert.mockResolvedValue();
      
        const artist = await Artist.get(artistName);
      
        expect(artist).toEqual(mockArtist);
      });      
  });
});

