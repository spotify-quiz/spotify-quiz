import { useEffect, useState } from 'react';
import { customGet } from '../utils/customGet';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

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

// Add the new prop to the Select component
interface SelectProps {
    onPlaylistSelect: (playlistId: string) => void;
}

function Select({ onPlaylistSelect }: SelectProps) {
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

    // Add a new state to store the selected playlist ID
    const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');

    // Update the handlePlaylistClick function
    const handlePlaylistClick = () => {
        if (selectedPlaylistId) {
            router.push({
                pathname: '/renderQuiz',
                query: { playlistId: selectedPlaylistId },
            });
        } else {
            alert('Please select a playlist');
        }
    };


    // Handle dropdown change
    const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedPlaylistId(event.target.value);
    };

    const handleLogout = () => {
        router.push('/logout');
    };

    return (
        <div>
            <button onClick={handleLogout}>Logout</button>
            <h2>Playlists</h2>
            {/* Replace the unordered list with a dropdown */}
            <select onChange={handleDropdownChange}>
                <option value="">Select a playlist</option>
                {playlists.map((playlist: Playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                        {playlist.name}
                    </option>
                ))}
            </select>
            <button onClick={handlePlaylistClick}>Submit</button>
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
