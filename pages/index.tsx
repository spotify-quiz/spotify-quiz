import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const redirectUri = encodeURIComponent(
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || ''
);

export default function Index() {
  const router = useRouter();

  const handleLoginClick = () => {
    const scopes = [
      'playlist-read-private',
      'playlist-read-collaborative',
    ].join('%20');

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=${scopes}`;

    window.location.href = authUrl;
  };

  const handleGuestClick = () => {
    Cookies.set('guest', 'true');
    router.push('/SelectPage');
  };

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-20">
      <button
        className="flex px-12 py-2 text-lg tracking-widest uppercase rounded-full focus:outline-none bg-primary hover:bg-opacity-80"
        onClick={handleLoginClick}
      >
        Login with Spotify
      </button>
      <button
        className="text-lg text-gray-500 underline hover:text-gray-800 focus:outline-none"
        onClick={handleGuestClick}
      >
        Continue as Guest
      </button>
    </div>
  );
}
