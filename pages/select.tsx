import axios from 'axios';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';

interface Playlist {
  id: string;
  name: string;
}

interface SpotifyResponse {
  playlists: {
    items: Playlist[];
  };
  items: Playlist[];
}

interface Props {
  accessToken: string | null;
}

const Select = ({ accessToken }: Props) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string>('');
  const router = useRouter();
  useEffect(() => {
    const fetchPlaylists = async () => {
      if (accessToken) {
        const response = await axios.get<SpotifyResponse>(
          'https://api.spotify.com/v1/me/playlists',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setPlaylists(response.data.items);
      } else {
        const client_id = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const client_secret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

        const credentials = Buffer.from(
          `${client_id}:${client_secret}`
        ).toString('base64');
        const authOptions = {
          url: 'https://accounts.spotify.com/api/token',
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: 'grant_type=client_credentials',
        };

        let token;

        try {
          const response = await axios(authOptions);
          token = response.data.access_token;
          console.log(token);
        } catch (error) {
          console.error(error);
        }

        if (token) {
          // Get the featured playlists using the token
          const response = await axios.get<SpotifyResponse>(
            'https://api.spotify.com/v1/browse/featured-playlists',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPlaylists(response.data.playlists.items);
        }
      }
    };

    fetchPlaylists();
  }, [accessToken]);

  const handlePlaylistChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedPlaylist(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push({
      pathname: '/renderQuiz',
      query: {
        playlistId: selectedPlaylist,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Select a Playlist</h2>
      <select value={selectedPlaylist} onChange={handlePlaylistChange}>
        <option value="">Select a Playlist</option>
        {/* Display the user's playlists if logged in */}
        {accessToken && (
          <>
            <optgroup label="Your Playlists">
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Featured Playlists">
              {/* Add featured playlists for logged-in users */}
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </optgroup>
          </>
        )}
        {/* Display the featured playlists for guests */}
        {!accessToken && (
          <optgroup label="Featured Playlists">
            {playlists.map((playlist) => (
              <option key={playlist.id} value={playlist.id}>
                {playlist.name}
              </option>
            ))}
          </optgroup>
        )}
      </select>
      <button type="submit" disabled={!selectedPlaylist}>
        Start Quiz
      </button>
    </form>
  );
};

// Get the access token from cookies
export const getServerSideProps = async (context) => {
  const { access_token } = parseCookies(context);

  return {
    props: {
      accessToken: access_token || null,
    },
  };
};

export default Select;
