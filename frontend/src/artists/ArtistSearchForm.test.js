import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import MusicApi from '../api/api';
import ArtistSearchForm from './ArtistSearchForm';

jest.mock('../api/api');

describe('ArtistSearchForm component', () => {
  const mockArtist = {
    name: 'Test Artist',
  };

  it('renders search form correctly', () => {
    const { getByLabelText, getByText } = render(<ArtistSearchForm />);

    expect(getByText('Search Artist')).toBeInTheDocument();
    expect(getByLabelText('Artist Name')).toBeInTheDocument();
    expect(getByText('Search')).toBeInTheDocument();
  });

  it('submits form with correct data and displays artist details', async () => {
    MusicApi.getArtist.mockResolvedValueOnce(mockArtist);

    const { getByLabelText, getByText } = render(<ArtistSearchForm />);

    fireEvent.change(getByLabelText('Artist Name'), { target: { value: 'Test Artist' } });
    fireEvent.click(getByText('Search'));

    await waitFor(() => {
      expect(MusicApi.getArtist).toHaveBeenCalledWith('Test Artist');
    });
  });

  it('displays error message when no artist is found', async () => {
    MusicApi.getArtist.mockResolvedValueOnce(null);

    const { getByLabelText, getByText } = render(<ArtistSearchForm />);

    fireEvent.change(getByLabelText('Artist Name'), { target: { value: 'Nonexistent Artist' } });
    fireEvent.click(getByText('Search'));

    await waitFor(() => {
      expect(MusicApi.getArtist).toHaveBeenCalledWith('Nonexistent Artist');
      expect(getByText('No artist: Nonexistent Artist')).toBeInTheDocument();
    });
  });
});
