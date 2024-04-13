import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import MusicApi from '../api/api';
import ArtistDetail from './ArtistDetail';

jest.mock('../api/api');

describe('ArtistDetail component', () => {
  const mockArtist = {
    name: 'Test Artist',
    genre: 'Test Genre',
    gender: 'Test Gender',
    born_year: 'Test Born Year',
    died_year: 'Test Died Year',
    label: 'Test Label',
    formed_year: 'Test Formed Year',
    disbanded_year: 'Test Disbanded Year',
    style: 'Test Style',
    mood: 'Test Mood',
    country: 'Test Country',
    website: 'testwebsite.com',
    facebook: 'testfacebook.com',
    thumb: 'testthumb.jpg',
    logo: 'testlogo.jpg',
    art1: 'testart1.jpg',
    art2: 'testart2.jpg',
    art3: 'testart3.jpg',
    bio: 'Test Biography',
  };

  it('renders artist details correctly', async () => {
    MusicApi.getArtist.mockResolvedValueOnce(mockArtist);

    const { getByText, getByAltText, getByRole } = render(<ArtistDetail name="Test Artist" />);

    await waitFor(() => {
      expect(getByText('Test Artist')).toBeInTheDocument();
      expect(getByText('Genre: Test Genre')).toBeInTheDocument();
      expect(getByText('Gender: Test Gender')).toBeInTheDocument();
      expect(getByText('Borned year: Test Born Year')).toBeInTheDocument();
      expect(getByText('Died year: Test Died Year')).toBeInTheDocument();
      expect(getByText('Label: Test Label')).toBeInTheDocument();
      expect(getByText('Formed year: Test Formed Year')).toBeInTheDocument();
      expect(getByText('Disbanded year: Test Disbanded Year')).toBeInTheDocument();
      expect(getByText('Style: Test Style')).toBeInTheDocument();
      expect(getByText('Mood: Test Mood')).toBeInTheDocument();
      expect(getByAltText('Test Artist')).toBeInTheDocument();
      expect(getByRole('img', { name: 'testlogo.jpg' })).toBeInTheDocument();
      expect(getByRole('img', { name: 'testart1.jpg' })).toBeInTheDocument();
      expect(getByRole('img', { name: 'testart2.jpg' })).toBeInTheDocument();
      expect(getByRole('img', { name: 'testart3.jpg' })).toBeInTheDocument();
      expect(getByText('Biography')).toBeInTheDocument();
      expect(getByText('Test Biography')).toBeInTheDocument();
    });
  });
});
