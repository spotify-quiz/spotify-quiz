import { render, screen, fireEvent } from '@testing-library/react';
import SelectPlaylist from '../pages/select-playlist';
import { useRouter } from 'next/router';
import axios from 'axios';
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('axios');

describe('SelectPlaylist', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
    });

    (axios.post as jest.Mock).mockResolvedValue({
      data: {
        access_token: 'fake_access_token',
      },
    });

    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        items: [],
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the SelectPlaylist component', () => {
    render(<SelectPlaylist />);

    expect(screen.getByText('Select a Playlist:')).toBeInTheDocument();
  });

  it('handles Go Back button click', () => {
    const pushSpy = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: pushSpy,
    });

    render(<SelectPlaylist />);
    fireEvent.click(screen.getByText('Go Back'));

    expect(pushSpy).toHaveBeenCalledWith('/');
  });

  it('handles Logout button click', async () => {
    (useRouter as jest.Mock).mockReturnValue({
      query: {},
      push: jest.fn(),
    });

    render(<SelectPlaylist />);

    const originalLocalStorageRemoveItem = window.localStorage.removeItem;
    window.localStorage.removeItem = jest.fn();
    window.open = jest.fn();

    fireEvent.click(screen.getByText('Logout'));

    setTimeout(() => {
      expect(useRouter().push).toHaveBeenCalledWith('/');
    }, 1500);

    window.localStorage.removeItem = originalLocalStorageRemoveItem;
  });

  // You can add more test cases to cover specific functionality
});
