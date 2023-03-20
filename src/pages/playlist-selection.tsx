import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
export default function PlaylistSelection() {
  const userAuth = useAuth();
  const user = useUser();
  const router = useRouter();
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    console.log(user);
    if (user) {
      userAuth.getToken().then((accessToken) => {
        axios
          .get(`https://api.spotify.com/v1/users/${user.user?.id}/playlists`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((response) => {
            console.log(response.data);
            setPlaylists(response.data.items);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }, [user]);

  if (!user) {
    return <div>You are not logged in.</div>;
  }

  return (
    <div>
      <h1>Select a Playlist</h1>
      <ul>
        {playlists.map((playlist) => (
          <li
            key={playlist.id}
            onClick={() => router.push(`/quiz?playlistId=${playlist.id}`)}
          >
            {playlist.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
