import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styles from '../styles/SelectPlaylist.module.css';

type Playlist = {
  id: string;
  name: string;
  totalTracks: number;
  imageUrl: string;
};

type Track = {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
};

export default function SelectPlaylist() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [tracks, setTracks] = useState<Track[]>([]);
  const [guestAccessToken, setGuestAccessToken] = useState<string | null>(null);
  const [isLockedIn, setIsLockedIn] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const isGuest = router.query.isGuest === 'true';

  const lockInPlaylist = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setIsLockedIn(true);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAccessToken(localStorage.getItem('access_token'));
    }
    if (isGuest) {
      const CLIENT_ID = 'c42afe5c1f9d450ea196e4a1df7f6fc4';
      const CLIENT_SECRET = '19f303ef68ad41448c08bf2f7b69d937';

      const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
        'base64'
      );

      axios
        .post('https://accounts.spotify.com/api/token', null, {
          headers: {
            Authorization: `Basic ${authString}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          params: {
            grant_type: 'client_credentials',
            fields: 'tracks.items(track(id,name,album(images),artists(name)))',
          },
        })
        .then((response) => {
          const token = response.data.access_token;

          setGuestAccessToken(token);

          axios
            .get('https://api.spotify.com/v1/browse/featured-playlists', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              const data = response.data;
              const featuredPlaylists: Playlist[] = data.playlists.items.map(
                (item: any) => ({
                  id: item.id,
                  name: item.name,
                  totalTracks: item.tracks.total,
                  imageUrl: item.images[0].url,
                })
              );
              setPlaylists(featuredPlaylists);
            })
            .catch((error) => {
              console.error(error);
            });
        });
    } else if (accessToken) {
      axios
        .get('https://api.spotify.com/v1/me/playlists', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const data = response.data;
          const userPlaylists: Playlist[] = data.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            totalTracks: item.tracks.total,
            imageUrl: item.images[0].url,
          }));
          setPlaylists(userPlaylists);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [accessToken, isGuest]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    const logoutWindow = window.open(
      'https://www.spotify.com/logout',
      'Spotify Logout',
      'width=450,height=300'
    );
    setTimeout(() => {
      logoutWindow?.close();
      router.push('/');
    }, 1500);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  const selectPlaylist = async (playlist: Playlist) => {
    if (playlist === selectedPlaylist) {
      // If the same playlist is clicked again, close the tracks showing
      setSelectedPlaylist(null);
      setTracks([]);
    } else {
      setSelectedPlaylist(playlist);
    }

    const authToken = isGuest ? guestAccessToken : accessToken;

    if (authToken) {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const fetchedTracks: Track[] = response.data.items
        .slice(0, 10)
        .map((item: any) => ({
          id: item.track.id,
          name: item.track.name,
          artist: item.track.artists[0].name,
          imageUrl: item.track.album.images[0].url,
        }));
      setTracks(fetchedTracks);
    }
  };

  const filteredPlaylists = playlists.filter(
    (playlist) => playlist.totalTracks > 5
  );

  const goToRenderQuiz = () => {
    if (selectedPlaylist) {
      console.log('click');
      router.push(`/renderQuiz?playlistId=${selectedPlaylist.id}`);
    }
  };
  return (
    <div className={`${styles.container} bg-gray-800`}>
      <div className={`${styles.font} mt-4`}>
        {isGuest ? (
          <button
            className="text-white mr-4 px-4 py-2 rounded-lg"
            onClick={handleGoBack}
          >
            Go Back
          </button>
        ) : (
          <>
            <button
              className="text-white mr-4 px-4 py-2 rounded-lg"
              onClick={handleGoBack}
            >
              Go Back
            </button>
            <button
              className="text-white px-4 py-2 bg-red-500 rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>

      <div className={styles.font} style={{ textAlign: 'center' }}>
        <h1 className="text-white">Select a Playlist:</h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {filteredPlaylists.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => selectPlaylist(playlist)}
              style={{
                width: '150px',
                height: '150px',
                cursor: 'pointer',
                border:
                  selectedPlaylist === playlist ? '2px solid green' : 'none',
                boxSizing: 'border-box',
              }}
            >
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                style={{ width: '100%', height: '100%' }}
                data-playlist-id={playlist.id}
              />
            </div>
          ))}
        </div>
        <button
          className={`mt-4 ${
            selectedPlaylist
              ? 'text-white px-4 py-2 bg-green-500 rounded-lg'
              : 'text-white px-4 py-2 opacity-50 bg-green-500 rounded-lg'
          } text-white`}
          onClick={goToRenderQuiz}
          disabled={!selectedPlaylist}
        >
          Submit
        </button>
      </div>
      {selectedPlaylist && (
        <div className={`${styles.font} text-white`}>
          <h2>Selected Playlist: {selectedPlaylist.name}</h2>
          <div className="flex justify-center flex-wrap gap-4">
            {tracks.map((track) => (
              <div key={track.id}>
                <img
                  src={track.imageUrl}
                  alt={track.name}
                  className="w-24 h-24 mb-2"
                />
                <div className="w-24 h-6 overflow-hidden">
                  <div className={`${styles.trackName}`}>{track.name}</div>
                </div>
                <div className="w-24 h-6 overflow-hidden">
                  <div>{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}