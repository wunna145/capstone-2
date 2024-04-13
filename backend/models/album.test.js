const db = require('../db');
const fetchAndInsert = require('../helpers/fetchAndInsertData');
const Album = require('./album');

jest.mock('../db');
jest.mock('../helpers/fetchAndInsertData');

describe('Album', () => {
  describe('findAll', () => {
    it('should retrieve all albums from the database', async () => {
      const mockAlbums = [{ id: 1, name: 'Album 1' }, { id: 2, name: 'Album 2' }];
      db.query.mockResolvedValue({ rows: mockAlbums });

      const albums = await Album.findAll();

      expect(albums).toEqual(mockAlbums);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database query error', async () => {
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);

      await expect(Album.findAll()).rejects.toThrow(error);

      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('get', () => {
    it('should retrieve an album by artist name and album name', async () => {
      const artistName = 'Artist 1';
      const albumName = 'Album 1';
      const mockAlbum = { id: 1, name: albumName, artist_name: artistName };
      db.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [mockAlbum] });
      fetchAndInsert.mockResolvedValue();

      const album = await Album.get(artistName, albumName);

      expect(album).toEqual(mockAlbum);
      expect(fetchAndInsert).toHaveBeenCalledTimes(1);
    });

    it('should handle database query error', async () => {
      const artistName = 'Artist 1';
      const albumName = 'Album 1';
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);
      fetchAndInsert.mockResolvedValue();

      await expect(Album.get(artistName, albumName)).rejects.toThrow(error);

    });

    it('should handle existing album', async () => {
      const artistName = 'Artist 1';
      const albumName = 'Album 1';
      const mockAlbum = { id: 1, name: albumName, artist_name: artistName };
      db.query.mockResolvedValueOnce({ rows: [{ id: 1 }] }).mockResolvedValueOnce({ rows: [mockAlbum] });
      fetchAndInsert.mockResolvedValue();

      const album = await Album.get(artistName, albumName);

      expect(album).toEqual(mockAlbum);
    });
  });
});
