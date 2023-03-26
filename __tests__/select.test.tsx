import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import SelectPlaylist from '../pages/select-playlist';
import mockRouter from 'next-router-mock';

jest.mock('axios');

jest.mock('next/router', () => require('next-router-mock'));

describe('SelectPlaylist component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should go back when the Go Back button is clicked', async () => {
    const pushMock = jest.fn();
    mockRouter.push = pushMock;
    render(<SelectPlaylist />);

    const goBackButton = screen.getByText('Go Back');
    fireEvent.click(goBackButton);

    expect(pushMock).toHaveBeenCalledWith('/');
  });
  it('should log out when the Logout button is clicked', () => {
    // Mock localStorage.removeItem
    Storage.prototype.removeItem = jest.fn();

    render(<SelectPlaylist />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(Storage.prototype.removeItem).toHaveBeenCalledWith('access_token');
  });
  it('should disable the Submit button if no playlist is selected', () => {
    render(<SelectPlaylist />);

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });
  // it('should enable the Submit button if a playlist is selected', async () => {
  //     const getPlaylistsMock = {
  //         data: {
  //             items: [
  //                 {
  //                     id:'123',
  //                     name: 'Playlist 1',
  //                     totalTracks: 10,
  //                     images: [{ url: 'https://example.com/image.jpg' }],
  //                 },
  //             ],
  //         },
  //     };
  //     const getMock = jest.spyOn(axios, 'get');
  //     getMock.mockImplementation(() => Promise.resolve(getPlaylistsMock));
  //     render(<SelectPlaylist />);
  //
  //
  //     const playlistImage = screen.getByAltText('Playlist 1');
  //
  //
  //     const submitButton = screen.getByText('Submit');
  //     expect(submitButton).toBeEnabled();
  // });
  // it('should navigate to the renderQuiz page when a playlist is selected and the Submit button is clicked', async () => {
  //     const getPlaylistsMock = {
  //         data: {
  //             items: [
  //                 {
  //                     id: '123',
  //                     name: 'Playlist 1',
  //                     totalTracks: 10,
  //                     images: [{ url: 'https://example.com/image.jpg' }],
  //                 },
  //             ],
  //         },
  //     };
  //     axios.get.mockResolvedValue(getPlaylistsMock);
  //
  //     const pushMock = useRouter().push;
  //     render(<SelectPlaylist />);
  //
  //     const playlistImage = screen.getByAltText('Playlist 1');
  //     fireEvent.click(playlistImage);
  //
  //     const submitButton = screen.getByText('Submit');
  //     fireEvent.click(submitButton);
  //
  //     expect(pushMock).toHaveBeenCalledWith('/renderQuiz?playlistId=123');
  //
  // });
});
