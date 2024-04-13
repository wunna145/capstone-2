import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import AlbumSearchForm from './AlbumSearchForm';
import MusicApi from '../api/api';

jest.mock('../api/api');

describe('AlbumSearchForm component', () => {
  it('renders search form correctly', () => {
    const { getByLabelText, getByText } = render(<AlbumSearchForm />);

    expect(getByText('Search Album')).toBeInTheDocument();
    expect(getByLabelText('Artist Name')).toBeInTheDocument();
    expect(getByLabelText('Album Name')).toBeInTheDocument();
    expect(getByText('Search')).toBeInTheDocument();
  });

  it('submits form with correct data and displays album details', async () => {
    const mockAlbum = {
      artist_name: 'Artist',
      name: 'Album',
    };
    MusicApi.getAlbum.mockResolvedValueOnce(mockAlbum);
  
    const { getByLabelText, getByText } = render(<AlbumSearchForm />);
  
    fireEvent.change(getByLabelText('Artist Name'), { target: { value: 'Artist' } });
    fireEvent.change(getByLabelText('Album Name'), { target: { value: 'Album' } });
    fireEvent.click(getByText('Search'));
  
    await waitFor(() => {
      expect(MusicApi.getAlbum).toHaveBeenCalledWith('Artist', 'Album');
      expect(getByText('Album Name')).toBeInTheDocument();
    });
  });
  

  it('displays error message when no album is found', async () => {
    MusicApi.getAlbum.mockResolvedValueOnce(null);

    const { getByLabelText, getByText } = render(<AlbumSearchForm />);

    fireEvent.change(getByLabelText('Artist Name'), { target: { value: 'Artist' } });
    fireEvent.change(getByLabelText('Album Name'), { target: { value: 'Album' } });
    fireEvent.click(getByText('Search'));

    await waitFor(() => {
      expect(MusicApi.getAlbum).toHaveBeenCalledWith('Artist', 'Album');
      expect(getByText('No album: Album')).toBeInTheDocument();
    });
  });
});
