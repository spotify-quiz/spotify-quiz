// pages/logout.js
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const handleLogout = () => {
      const url = 'https://www.spotify.com/logout/';
      const spotifyLogoutWindow = window.open(
        url,
        'Spotify Logout',
        'width=700,height=500,top=40,left=40'
      );
      if (spotifyLogoutWindow !== null) {
        spotifyLogoutWindow.opener = null; // For security reasons
      }

      setTimeout(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        spotifyLogoutWindow.close();
        await signOut({
          callbackUrl: `${window.location.origin}/`,
          redirect: true,
        });
      }, 2000);
    };

    handleLogout();
  }, [router]);

  return (
    <div>
      <h1>Logging out...</h1>
      <p>
        Please close the Spotify logout window if it doesn't close
        automatically.
      </p>
    </div>
  );
}
