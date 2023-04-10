import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useRouter as useRouterNext } from 'next/router';
import Callback from '../pages/callback';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const useRouter = useRouterNext as jest.Mock;

describe('Callback component', () => {
  let mockRouter;

  beforeEach(() => {
    mockRouter = { push: jest.fn() };
    useRouter.mockReturnValue(mockRouter);
    Object.defineProperty(window, 'location', {
      value: {
        hash: '',
      },
      writable: true,
    });
    localStorage.clear(); // Add this line
  });

  it('renders successfully', () => {
    render(<Callback />);
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });

  it('calls useEffect and processes hash', () => {
    console.log = jest.fn();
    window.location.hash = '#access_token=test_token';

    render(<Callback />);

    expect(console.log).toHaveBeenCalledWith('callback');
    expect(mockRouter.push).toHaveBeenCalledWith('/select-playlist');
    expect(localStorage.getItem('access_token')).toEqual('test_token');
  });

  it('does not process an empty hash', () => {
    console.log = jest.fn();
    window.location.hash = '';

    render(<Callback />);

    expect(console.log).toHaveBeenCalledWith('callback');
    expect(mockRouter.push).not.toHaveBeenCalled();
    expect(localStorage.getItem('access_token')).toBeNull();
  });
});
