import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SelectPlaylist from '../pages/select-playlist';
import mockRouter from 'next-router-mock';
import axios from 'axios';
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
  it('should fetch and display featured playlists for guest users', async () => {
    const axiosPostMock = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        access_token: 'mock_access_token',
      },
    });

    const axiosGetMock = jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        playlists: {
          items: [
            {
              id: '123',
              name: 'Test Playlist',
              tracks: {
                total: 10,
              },
              images: [
                {
                  url: 'https://example.com/image.jpg',
                },
              ],
            },
          ],
        },
      },
    });

    mockRouter.query.isGuest = 'true';
    render(<SelectPlaylist />);

    await waitFor(() => {
      expect(axiosPostMock).toHaveBeenCalled();
      expect(axiosGetMock).toHaveBeenCalled();
    });

    const playlistCard = screen.getByTestId('playlist-0');
    expect(playlistCard).toBeInTheDocument();
    expect(playlistCard).toHaveStyle('cursor: pointer');
  });

  it('should fetch and display tracks when a playlist is selected for guest users', async () => {
    const axiosPostMock = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        access_token: 'mock_access_token',
      },
    });

    const axiosGetMock = jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url.includes('browse/featured-playlists')) {
        return Promise.resolve({
          data: {
            playlists: {
              items: [
                {
                  id: '123',
                  name: 'Test Playlist',
                  tracks: {
                    total: 10,
                  },
                  images: [
                    {
                      url: 'https://example.com/image.jpg',
                    },
                  ],
                },
              ],
            },
          },
        });
      } else {
        return Promise.resolve({
          data: {
            items: [
              {
                track: {
                  id: 'track-1',
                  name: 'Test Track',
                  artists: [
                    {
                      name: 'Test Artist',
                    },
                  ],
                  album: {
                    images: [
                      {
                        url: 'https://example.com/track-image.jpg',
                      },
                    ],
                  },
                },
              },
            ],
          },
        });
      }
    });

    mockRouter.query.isGuest = 'true';
    render(<SelectPlaylist />);

    await waitFor(() => {
      expect(axiosPostMock).toHaveBeenCalled();
      expect(axiosGetMock).toHaveBeenCalled();
    });

    const playlistCard = screen.getByTestId('playlist-0');
    fireEvent.click(playlistCard);

    await waitFor(() => expect(axiosGetMock).toHaveBeenCalledTimes(2));

    const trackName = screen.getByText('Test Track');
    expect(trackName).toBeInTheDocument();
  });

  it('should hide tracks when the same playlist is selected again for guest users', async () => {
    const axiosPostMock = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        access_token: 'mock_access_token',
      },
    });

    const axiosGetMock = jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url.includes('browse/featured-playlists')) {
        return Promise.resolve({
          data: {
            playlists: {
              items: [
                {
                  id: '123',
                  name: 'Test Playlist',
                  tracks: {
                    total: 10,
                  },
                  images: [
                    {
                      url: 'https://example.com/image.jpg',
                    },
                  ],
                },
              ],
            },
          },
        });
      } else {
        return Promise.resolve({
          data: {
            items: [
              {
                track: {
                  id: 'track-1',
                  name: 'Test Track',
                  artists: [
                    {
                      name: 'Test Artist',
                    },
                  ],
                  album: {
                    images: [
                      {
                        url: 'https://example.com/track-image.jpg',
                      },
                    ],
                  },
                },
              },
            ],
          },
        });
      }
    });

    mockRouter.query.isGuest = 'true';
    render(<SelectPlaylist />);

    await waitFor(() => {
      expect(axiosPostMock).toHaveBeenCalled();
      expect(axiosGetMock).toHaveBeenCalled();
    });

    const playlistCard = screen.getByTestId('playlist-0');
    fireEvent.click(playlistCard);

    await waitFor(() => expect(axiosGetMock).toHaveBeenCalledTimes(2));

    const trackName = screen.getByText('Test Track');
    expect(trackName).toBeInTheDocument();
    fireEvent.click(playlistCard);

    await waitFor(() => expect(axiosGetMock).toHaveBeenCalledTimes(3));
  });

  it('should fetch and display user playlists for logged-in users', async () => {
    // Set the mock access token in local storage
    Storage.prototype.getItem = jest.fn(() => 'mock_access_token');

    const axiosGetMock = jest.spyOn(axios, 'get').mockResolvedValue({
      data: {
        items: [
          {
            id: '123',
            name: 'Test Playlist',
            tracks: {
              total: 10,
            },
            images: [
              {
                url: 'https://example.com/image.jpg',
              },
            ],
          },
        ],
      },
    });

    // Remove isGuest from the router query
    delete mockRouter.query.isGuest;

    render(<SelectPlaylist />);

    await waitFor(() => {
      expect(axiosGetMock).toHaveBeenCalled();
    });

    const playlistCard = screen.getByTestId('playlist-0');
    expect(playlistCard).toBeInTheDocument();
    expect(playlistCard).toHaveStyle('cursor: pointer');
  });

  it('should navigate to the RenderQuiz page with correct query parameters when the Submit button is clicked for guest users', async () => {
    const axiosPostMock = jest.spyOn(axios, 'post').mockResolvedValue({
      data: {
        access_token: 'mock_access_token',
      },
    });

    const axiosGetMock = jest.spyOn(axios, 'get').mockImplementation((url) => {
      if (url.includes('browse/featured-playlists')) {
        return Promise.resolve({
          data: {
            playlists: {
              items: [
                {
                  id: '123',
                  name: 'Test Playlist',
                  tracks: {
                    total: 10,
                  },
                  images: [
                    {
                      url: 'https://example.com/image.jpg',
                    },
                  ],
                },
              ],
            },
          },
        });
      } else {
        return Promise.resolve({
          data: {
            items: [
              {
                track: {
                  id: 'track-1',
                  name: 'Test Track',
                  artists: [
                    {
                      name: 'Test Artist',
                    },
                  ],
                  album: {
                    images: [
                      {
                        url: 'https://example.com/track-image.jpg',
                      },
                    ],
                  },
                },
              },
            ],
          },
        });
      }
    });

    mockRouter.query.isGuest = 'true';
    render(<SelectPlaylist />);

    await waitFor(() => {
      expect(axiosPostMock).toHaveBeenCalled();
      expect(axiosGetMock).toHaveBeenCalled();
    });

    const playlistCard = screen.getByTestId('playlist-0');
    fireEvent.click(playlistCard);

    const timeLimitDropdown = screen.getByLabelText('Time Limit:');
    fireEvent.change(timeLimitDropdown, { target: { value: '10' } });

    const numQuestionsDropdown = screen.getByLabelText('Number of Questions:');
    fireEvent.change(numQuestionsDropdown, { target: { value: '15' } });

    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);

    expect(mockRouter.push).toHaveBeenCalledWith(
      '/renderQuiz?playlistId=123&timeLimit=10&numQuestions=15'
    );
  });
});
