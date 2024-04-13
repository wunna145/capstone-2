const db = require('../db');
const bcryptjs = require('bcryptjs');
const User = require('./user');
const { NotFoundError, BadRequestError, UnauthorizedError } = require('../expressError');

jest.mock('../db');
jest.mock('bcryptjs');

describe('User', () => {
  describe('authenticate', () => {
    it('should authenticate a user with valid credentials', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const hashedPassword = await bcryptjs.hash(password, 10);
      const user = {
        username,
        password: hashedPassword,
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      };
      db.query.mockResolvedValue({ rows: [user] });
      bcryptjs.compare.mockResolvedValue(true);

      const authenticatedUser = await User.authenticate(username, password);

      expect(authenticatedUser).toEqual({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      });
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(bcryptjs.compare).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedError for invalid credentials', async () => {
      const username = 'testuser';
      const password = 'invalidpassword';
      const user = {
        username,
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com'
      };
      db.query.mockResolvedValue({ rows: [user] });
      bcryptjs.compare.mockResolvedValue(false);

      await expect(User.authenticate(username, password)).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError for non-existent user', async () => {
      const username = 'nonexistentuser';
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.authenticate(username, 'password')).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'newuser',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com'
      };
      const hashedPassword = 'hashedpassword';
      db.query.mockResolvedValueOnce({ rows: [] });
      bcryptjs.hash.mockResolvedValue(hashedPassword);
      db.query.mockResolvedValueOnce({ rows: [{ username: userData.username, firstName: userData.firstName, lastName: userData.lastName, email: userData.email }] });

      const registeredUser = await User.register(userData);

      expect(registeredUser).toEqual({
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      });
    });

    it('should throw BadRequestError for duplicate username', async () => {
      const userData = {
        username: 'existinguser',
        password: 'password',
        firstName: 'Existing',
        lastName: 'User',
        email: 'existinguser@example.com'
      };
      db.query.mockResolvedValueOnce({ rows: [{ username: userData.username }] });

      await expect(User.register(userData)).rejects.toThrow(BadRequestError);
    });
  });

  describe('findAll', () => {
    it('should retrieve all users', async () => {
      const users = [
        { username: 'user1', firstName: 'User', lastName: 'One', email: 'user1@example.com' },
        { username: 'user2', firstName: 'User', lastName: 'Two', email: 'user2@example.com' }
      ];
      db.query.mockResolvedValue({ rows: users });

      const retrievedUsers = await User.findAll();

      expect(retrievedUsers).toEqual(users);
    });
  });

  describe('get', () => {
    it('should retrieve a user by username', async () => {
      const username = 'testuser';
      const user = { username, firstName: 'Test', lastName: 'User', email: 'test@example.com' };
      db.query.mockResolvedValue({ rows: [user] });

      const retrievedUser = await User.get(username);

      expect(retrievedUser).toEqual(user);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      const username = 'nonexistentuser';
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.get(username)).rejects.toThrow(NotFoundError);
    });
  });

  describe('update', () => {
    it('should update user information', async () => {
      const username = 'testuser';
      const data = { password: 'newpassword', firstName: 'New', lastName: 'Name' };
      const updatedUser = { username, firstName: data.firstName, lastName: data.lastName, email: 'test@example.com' };
      bcryptjs.hash.mockResolvedValue('hashedpassword');
      db.query.mockResolvedValue({ rows: [updatedUser] });

      const updatedUserData = await User.update(username, data);

      expect(updatedUserData).toEqual(updatedUser);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      const username = 'nonexistentuser';
      const data = { firstName: 'New', lastName: 'Name' };
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.update(username, data)).rejects.toThrow(NotFoundError);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const username = 'testuser';
      db.query.mockResolvedValue({ rows: [{ username }] });

      await User.remove(username);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      const username = 'nonexistentuser';
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.remove(username)).rejects.toThrow(NotFoundError);
    });
  });

  describe('createPlaylist', () => {
    it('should create a new playlist for a user', async () => {
      const username = 'testuser';
      const songId = 1;
      db.query.mockResolvedValueOnce({ rows: [{ song_id: songId }] });
      db.query.mockResolvedValueOnce({ rows: [{ username }] });

      await User.createPlaylist(username, songId);
    });

    it('should throw NotFoundError for non-existent song', async () => {
      const username = 'testuser';
      const songId = 999;
      db.query.mockResolvedValueOnce({ rows: [] });
      db.query.mockResolvedValueOnce({ rows: [{ username }] });

      await expect(User.createPlaylist(username, songId)).rejects.toThrow(NotFoundError);
    });

    it('should throw NotFoundError for non-existent user', async () => {
      const username = 'nonexistentuser';
      const songId = 1;
      db.query.mockResolvedValueOnce({ rows: [{ song_id: songId }] });
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.createPlaylist(username, songId)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getPlaylist', () => {
    it('should retrieve a user\'s playlist', async () => {
      const username = 'testuser';
      const playlist = [{ song_id: 1 }, { song_id: 2 }];
      db.query.mockResolvedValueOnce({ rows: playlist });

      const retrievedPlaylist = await User.getPlaylist(username);

      expect(retrievedPlaylist).toEqual(playlist);
    });

    it('should throw NotFoundError for non-existent playlist', async () => {
      const username = 'nonexistentuser';
      db.query.mockResolvedValueOnce({ rows: [] });

      await expect(User.getPlaylist(username)).rejects.toThrow(NotFoundError);
    });
  });

  describe('deletePlaylist', () => {
    it('should delete a song from a user\'s playlist', async () => {
      const username = 'testuser';
      const songId = 1;
      db.query.mockResolvedValue({ rows: [{ song_id: songId }] });

      await User.deletePlaylist(username, songId);
    });

    it('should throw NotFoundError for non-existent playlist entry', async () => {
      const username = 'testuser';
      const songId = 999;
      db.query.mockResolvedValue({ rows: [] });

      await expect(User.deletePlaylist(username, songId)).rejects.toThrow(NotFoundError);
    });
  });
});

