import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlbumDetail from './AlbumDetail';
import MusicApi from '../api/api';

jest.mock('../api/api');

describe('AlbumDetail component', () => {
  it('renders loading spinner when album details are not available', async () => {
    MusicApi.getAlbum.mockResolvedValueOnce(null); // Simulate no album details initially

    const { getByTestId } = render(<AlbumDetail artistName="Artist" name="Album" />);

    expect(getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders album details once they are available', async () => {
    const albumDetails = {
      name: 'Album Name',
      artist_name: 'Artist',
      year_released: '2022',
      style: 'Pop',
      genre: 'Rock',
      description: 'This is an awesome album!',
      thumb: 'album.jpg',
    };

    MusicApi.getAlbum.mockResolvedValueOnce(albumDetails);

    const { getByText, getByAltText, getByTestId } = render(<AlbumDetail artistName="Artist" name="Album" />);

    await waitForElementToBeRemoved(() => getByTestId('loading-spinner'));

    expect(getByText('Album Name')).toBeInTheDocument();
    expect(getByText('Artist: Artist')).toBeInTheDocument();
    expect(getByText('Year Released: 2022')).toBeInTheDocument();
    expect(getByText('Style: Pop')).toBeInTheDocument();
    expect(getByText('Genre: Rock')).toBeInTheDocument();
    expect(getByText('Description')).toBeInTheDocument();
    expect(getByText('This is an awesome album!')).toBeInTheDocument();
    expect(getByAltText('Album Name')).toHaveAttribute('src', 'album.jpg');

    expect(MusicApi.getAlbum).toHaveBeenCalledWith('Artist', 'Album');
  });
});
