const db = require('../db');
const fetchAndInsert = require('../helpers/fetchAndInsertData');
const Song = require('./song');

jest.mock('../db');
jest.mock('../helpers/fetchAndInsertData');

describe('Song', () => {
  describe('findAll', () => {
    it('should retrieve all songs from the database', async () => {
      const mockSongs = [{ song_id: 1, name: 'Song 1' }, { song_id: 2, name: 'Song 2' }];
      db.query.mockResolvedValue({ rows: mockSongs });

      const songs = await Song.findAll();

      expect(songs).toEqual(mockSongs);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    it('should handle database query error', async () => {
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);

      await expect(Song.findAll()).rejects.toThrow(error);

      expect(db.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('getById', () => {

    it('should handle database query error', async () => {
      const songId = 1;
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);

      await expect(Song.getById(songId)).rejects.toThrow(error);
    });

    it('should retrieve a song by its unique identifier', async () => {
        const songId = 1;
        const mockSong = { song_id: songId, name: 'Song 1' };
        db.query.mockResolvedValue({ rows: [mockSong] });
  
        const song = await Song.getById(songId);
  
        expect(song).toEqual(mockSong);
    });
  });

  describe('get', () => {
    it('should retrieve a song by artist name and song name', async () => {
        const artistName = 'Artist 1';
        const songName = 'Song 1';
        const mockSong = { song_id: 1, name: songName };
        db.query.mockResolvedValueOnce({ rows: [mockSong] });
      
        const song = await Song.get(artistName, songName);
        console.log(song);
      
        expect(song).toEqual(mockSong);
      });
      

    it('should handle database query error', async () => {
      const artistName = 'Artist 1';
      const songName = 'Song 1';
      const error = new Error('Database error');
      db.query.mockRejectedValue(error);
      fetchAndInsert.mockResolvedValue();

      await expect(Song.get(artistName, songName)).rejects.toThrow(error);
    });

    it('should handle existing song', async () => {
        const artistName = 'Artist 1';
        const songName = 'Song 1';
        const error = new Error('Database error');
        db.query.mockRejectedValue(error);
        fetchAndInsert.mockResolvedValue();
      
        await expect(Song.get(artistName, songName)).rejects.toThrow(error);
    });
      
  });
});

