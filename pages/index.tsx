import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { customGet } from '../utils/customGet';
import Link from 'next/link';
// Add these type definitions at the beginning of your index.tsx file
interface SpotifyImage {
  url: string;
}

interface SpotifyProfile {
  display_name: string;
  images: SpotifyImage[];
}

export default function Index() {
  const { data: session } = useSession();
  const [spotifyProfile, setSpotifyProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchSpotifyProfile() {
      if (session) {
        const response = await customGet(
          'https://api.spotify.com/v1/me',
          session
        );
        setSpotifyProfile(response);
      }
    }

    fetchSpotifyProfile();
  }, [session]);

  const handleLogin = () => {
    signIn('spotify', { callbackUrl: 'http://localhost:3000/select' });
  };

  const handleGetStarted = () => {
    router.push('/select');
  };

  const isLoggedIn = !!session && !!spotifyProfile;

  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-20">
      {isLoggedIn ? (
        <>
          <Image
            src={
              (spotifyProfile as SpotifyProfile).images.length > 0
                ? (spotifyProfile as SpotifyProfile).images[0].url
                : 'https://wilcity.com/wp-content/uploads/2020/06/115-1150152_default-profile-picture-avatar-png-green.jpg' // Replace this with your preferred default image URL
            }
            width={100}
            height={100}
            alt="Profile"
          />

          <h2>Welcome, {(spotifyProfile as SpotifyProfile).display_name}!</h2>
          <p>You are already logged in.</p>
          <button
            className="flex px-12 py-2 text-lg tracking-widest uppercase rounded-full focus:outline-none bg-primary hover:bg-opacity-80"
            onClick={handleGetStarted}
          >
            LET'S GET STARTED!
          </button>
          <p className="text-xs">
            <p className="text-xs">
              <Link href="/logout">
                <a className="text-blue-500">Logout to change your account</a>
              </Link>
            </p>
          </p>
        </>
      ) : (
        <button
          className="flex px-12 py-2 text-lg tracking-widest uppercase rounded-full focus:outline-none bg-primary hover:bg-opacity-80"
          onClick={handleLogin}
        >
          Login with Spotify
        </button>
      )}
    </div>
  );
}
