import {getSession, signIn, useSession} from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { customGet } from '../utils/customGet';
import { MySession } from '../types/types';
import Link from 'next/link';
import { refreshAccessToken } from '../utils/refreshAccessToken';
import Cookies from 'js-cookie';
import Button from "./components/button";
// import Menu from "./menu";

interface SpotifyImage {
  url: string;
}

interface SpotifyProfile {
  display_name: string;
  images: SpotifyImage[];
}

export default function Index() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const { data: session } = useSession();
  const [spotifyProfile, setSpotifyProfile] = useState<SpotifyProfile | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const storedAccessToken = Cookies.get('accessToken');
    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }

    async function fetchSpotifyProfile() {
      if (session) {
        try {
          const response = await customGet('https://api.spotify.com/v1/me', session as MySession);
          setSpotifyProfile(response);
        } catch (error) {
          console.error('Error fetching Spotify profile:', error);
        }
      }
    }

    fetchSpotifyProfile();
  }, [session]);

  const handleLogin = () => {
    signIn('spotify');
  };

  const handleGetStarted = () => {
    router.push('/select');
  };

  const isLoggedIn = !!session && !!spotifyProfile;
  const handleRefreshToken = async () => {
    console.log("refresh!!!");
    if (session?.user?.refreshToken) {
      const newAccessToken = await refreshAccessToken(session.user.refreshToken);
      console.log('new token', newAccessToken);

      // Update access token state
      setAccessToken(newAccessToken);

      // Store the access token in a cookie
      Cookies.set('accessToken', newAccessToken);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen gap-20">
      {isLoggedIn ? (
        <>
          <Image
            src={
              (spotifyProfile as SpotifyProfile).images?.length > 0
                ? (spotifyProfile as SpotifyProfile).images[0].url
                : 'https://wilcity.com/wp-content/uploads/2020/06/115-1150152_default-profile-picture-avatar-png-green.jpg' // Replace this with your preferred default image URL
            }
            width={100}
            height={100}
            alt="Profile"
          />

          <h2>Welcome, {(spotifyProfile as SpotifyProfile).display_name}!</h2>
          <p>You are already logged in.</p>
          <p>Access Token: {accessToken}</p>
          <button
            className="flex px-6 py-2 text-sm tracking-widest uppercase rounded-full focus:outline-none bg-primary hover:bg-opacity-80"
            onClick={handleRefreshToken}
          >
            Refresh Access Token
          </button>
          <button
            className="flex px-12 py-2 text-lg tracking-widest uppercase rounded-full focus:outline-none bg-primary hover:bg-opacity-80"
            onClick={handleGetStarted}
          >
            LET'S GET STARTED!
          </button>
          <p className="text-xs">
            <p className="text-xs">
              <Link href="/logout">Logout to change your account</Link>
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
