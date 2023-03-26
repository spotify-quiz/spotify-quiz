import { render, screen, fireEvent } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import Login from '../pages/index';

jest.mock('next/router', () => require('next-router-mock'));

describe('Login component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render login buttons', () => {
    render(<Login />);

    const spotifyLoginButton = screen.getByText('Log in with Spotify');
    const guestLoginButton = screen.getByText('Continue as Guest');

    expect(spotifyLoginButton).toBeInTheDocument();
    expect(guestLoginButton).toBeInTheDocument();
  });

  it('should navigate to select-playlist page with guest flag when guest login button is clicked', () => {
    const pushMock = jest.fn();
    mockRouter.push = pushMock;

    render(<Login />);

    const guestButton = screen.getByText('Continue as Guest');
    fireEvent.click(guestButton);

    expect(pushMock).toHaveBeenCalledWith('/select-playlist?isGuest=true');
  });

  it('should call handleLogin when Log in with Spotify button is clicked', () => {
    // Store the original window.location object
    const originalWindowLocation = window.location;

    // Create a mock function for window.location.href setter
    const hrefMock = jest.fn();

    // Replace window.location with a custom object containing our hrefMock
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: {
        ...originalWindowLocation,
        set href(value) {
          hrefMock(value);
        },
      },
    });

    render(<Login />);

    const spotifyLoginButton = screen.getByText('Log in with Spotify');
    fireEvent.click(spotifyLoginButton);

    const expectedAuthEndpoint = 'https://accounts.spotify.com/authorize';
    const expectedClientId = process.env
      .NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
    const expectedRedirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI as string;
    const expectedScope = 'user-library-read playlist-read-private';

    const expectedUrlSearchParams = new URLSearchParams({
      client_id: expectedClientId,
      response_type: 'token',
      redirect_uri: expectedRedirectUri,
      scope: expectedScope,
    });

    const expectedUrl = `${expectedAuthEndpoint}?${expectedUrlSearchParams.toString()}`;

    expect(hrefMock).toHaveBeenCalledWith(expectedUrl);

    // Restore the original window.location object
    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: originalWindowLocation,
    });
  });

  it('should store access_token and navigate to select-playlist page when a hash with access_token is present', () => {
    const originalLocation = window.location;
    const access_token = 'test_token';

    // Mock the window location with the hash containing the access_token
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hash: `#access_token=${access_token}` },
    });

    const pushMock = jest.fn();
    mockRouter.push = pushMock;

    render(<Login />);

    // Check if the access_token is stored in localStorage
    expect(localStorage.getItem('access_token')).toBe(access_token);

    // Check if the router navigates to the select-playlist page
    expect(pushMock).toHaveBeenCalledWith('/select-playlist');

    // Clean up the access_token from localStorage
    localStorage.removeItem('access_token');

    // Restore the original location object
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
  });
});
