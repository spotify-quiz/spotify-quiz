import { useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';


const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI as string;
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string;
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
        <img src ="./images/Quizme.png" width={800} height={800}/>
        <button className={styles.button} onClick={handleLogin}>
          Log in with Spotify
        </button>
        <button className={styles.button} onClick={handleGuestLogin}>
          Continue as Guest
        </button>
      </div>
  );
}
