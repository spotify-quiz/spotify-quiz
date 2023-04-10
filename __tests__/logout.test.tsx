import { render } from '@testing-library/react';
import Logout from '../pages/logout';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

describe('Logout', () => {
  let openSpy;
  let closeSpy;
  let mockWindow;

  beforeEach(() => {
    openSpy = jest.spyOn(window, 'open');
    closeSpy = jest.fn();
    mockWindow = { close: closeSpy } as any;

    openSpy.mockImplementation(() => mockWindow);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  it('logs out user and closes Spotify logout window', async () => {
    jest.useFakeTimers();

    render(<Logout />);

    expect(openSpy).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(2000);

    expect(closeSpy).toHaveBeenCalledTimes(1);
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
