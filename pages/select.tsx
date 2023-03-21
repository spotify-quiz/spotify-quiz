import { useEffect, useState } from 'react';
import { customGet } from '../utils/customGet';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
// Add these type definitions at the beginning of your Select component file
interface Playlist {
  id: string;
  name: string;
}

interface Track {
  track: {
    id: string;
    name: string;
  };
}

function Select() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const response = await customGet(
        'https://api.spotify.com/v1/me/playlists',
        session
      );

      // Ensure the playlists are set to an array
      setPlaylists(response?.items ? response.items : []);
    }

    fetchData();
  }, [session]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const handlePlaylistClick = async (playlistId: string) => {
    const response = await customGet(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      session
    );

    // Ensure the tracks are set to an array
    setTracks(response?.items ? response.items : []);
  };

  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
      <h2>Playlists</h2>
      <ul>
        {playlists.map((playlist: Playlist) => (
          <li
            key={playlist.id}
            onClick={() => handlePlaylistClick(playlist.id)}
          >
            {playlist.name}
          </li>
        ))}
      </ul>
      <h2>Tracks</h2>
      <ul>
        {tracks.map((track: Track) => (
          <li key={track.track.id}>{track.track.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Select;
