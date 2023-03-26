import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../pages/index';
import { jest } from '@jest/globals';
import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Login', () => {
  it('renders the login component', () => {
    render(<Login />);

    expect(screen.getByText('Welcome to My Spotify App')).toBeInTheDocument();
    expect(screen.getByText('Log in with Spotify')).toBeInTheDocument();
    expect(screen.getByText('Continue as Guest')).toBeInTheDocument();
  });

  // Removed the second test block related to window.location.assign

  it('calls handleGuestLogin when clicking the Continue as Guest button', () => {
    const useRouterSpy = jest.spyOn(require('next/navigation'), 'useRouter');
    const pushSpy = jest.fn();
    useRouterSpy.mockReturnValue({ push: pushSpy });

    render(<Login />);
    fireEvent.click(screen.getByText('Continue as Guest'));

    expect(pushSpy).toHaveBeenCalledWith('/select-playlist?isGuest=true');
  });
});
