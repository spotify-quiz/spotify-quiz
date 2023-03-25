import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.module.css';

const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const REDIRECT_URI = 'http://localhost:3000/callback';
const CLIENT_ID = 'c42afe5c1f9d450ea196e4a1df7f6fc4';
const SCOPE = 'user-library-read playlist-read-private';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.split('=')[1];
      localStorage.setItem('access_token', token);
      router.push('/select-playlist');
    }
  }, []);

  const handleLogin = () => {
    const params = new URLSearchParams({
      client_id: CLIENT_ID,
      response_type: 'token',
      redirect_uri: REDIRECT_URI,
      scope: SCOPE,
    });
    const url = `${AUTH_ENDPOINT}?${params.toString()}`;
    window.location.href = url;
  };

  const handleGuestLogin = () => {
    router.push('/select-playlist?isGuest=true');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to My Spotify App</h1>
      <button className={styles.button} onClick={handleLogin}>
        Log in with Spotify
      </button>
      <button className={styles.button} onClick={handleGuestLogin}>
        Continue as Guest
      </button>
    </div>
  );
}
