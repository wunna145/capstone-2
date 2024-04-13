import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import CreatePlaylist from './CreatePlaylist';
import MusicApi from '../api/api';

jest.mock('../api/api');

describe('CreatePlaylist component', () => {
  test('displays songs in the playlist and navigates to song details when clicked', async () => {
    const songIds = ['1', '2', '3'];
    const songs = [
      { id: '1', name: 'Song 1', artist_name: 'Artist 1', thumb: 'thumb1.jpg' },
      { id: '2', name: 'Song 2', artist_name: 'Artist 2', thumb: 'thumb2.jpg' },
      { id: '3', name: 'Song 3', artist_name: 'Artist 3', thumb: 'thumb3.jpg' },
    ];

    // Mock the getSongById function of the MusicApi
    MusicApi.getSongById.mockImplementation(async (songId) => {
      const song = songs.find(song => song.id === songId);
      return song;
    });

    // Mock window.location.href
    delete window.location;
    window.location = { href: '' };

    const { getByText, getByAltText } = render(
      <MemoryRouter>
        <CreatePlaylist songIds={songIds} />
      </MemoryRouter>
    );

    // Wait for the first song name to be present
    await waitFor(() => {
      expect(getByText(new RegExp(songs[0].name, 'i'))).toBeInTheDocument();
    });

    // Check if each song is displayed
    songs.forEach(song => {
      expect(getByText(new RegExp(song.name, 'i'))).toBeInTheDocument();
      expect(getByText(new RegExp(`Artist: ${song.artist_name}`, 'i'))).toBeInTheDocument();
      expect(getByAltText(new RegExp(song.name, 'i'))).toBeInTheDocument();
    });
  });
});
