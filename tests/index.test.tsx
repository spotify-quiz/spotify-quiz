import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import Index from '../pages/index';

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
  signIn: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('Index page', () => {
  test('renders Login with Spotify button', () => {
    render(<Index />);
    const loginButton = screen.getByText('Login with Spotify');
    expect(loginButton).toBeInTheDocument();
  });

  test('calls signIn when Login with Spotify button is clicked', () => {
    render(<Index />);
    const loginButton = screen.getByText('Login with Spotify');
    fireEvent.click(loginButton);
    expect(signIn).toHaveBeenCalledWith('spotify');
  });
});
