import { render, screen, fireEvent } from '@testing-library/react';
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
});
