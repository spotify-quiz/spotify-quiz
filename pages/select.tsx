import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { getSession, useSession, signOut } from "next-auth/react";
import { List, ListItem, ListItemText, Button } from "@mui/material";
import { useState } from "react";

import { customGet } from "@/utils/customGet";
import { isAuthenticated } from "@/utils/isAuthenticated";

interface Playlist {
    id: string;
    name: string;
    owner: { display_name: string };
}


interface Track {
    track: {
        id: string;
        name: string;
        artists: { name: string }[];
    };
}

interface Props {
    playlists: Playlist[];
}

function handleLogout() {
    signOut();
}
export default function Select({ playlists }: Props) {
    const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
    const [tracks, setTracks] = useState<Track[] | null>(null);
    const { data: session } = useSession();

    const handlePlaylistClick = async (playlistId: string) => {
        const response = await customGet(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, session);
        setTracks(response.items || []);
        setSelectedPlaylist(playlistId);
    };


    return (
        <>
            <div className="flex justify-end mt-4">
                <Button onClick={handleLogout} variant="outlined">Logout</Button>
            </div>
            <List className="grid grid-cols-2 gap-4">
                {playlists.map((playlist: Playlist) => (
                    <ListItem
                        key={playlist.id}
                        className={`bg-white rounded-lg shadow-md ${
                            playlist.id === selectedPlaylist ? "bg-green-100" : ""
                        }`}
                        onClick={() => handlePlaylistClick(playlist.id)}
                    >
                        <ListItemText
                            primary={playlist.name}
                            secondary={`By ${playlist.owner.display_name}`}
                            primaryTypographyProps={{ className: "font-bold" }}
                            secondaryTypographyProps={{ className: "text-gray-500" }}
                        />
                    </ListItem>
                ))}
            </List>

            {tracks && tracks.length > 0 && (
                <List>
                    {tracks.map((track: Track) => (
                        <ListItem key={track.track.id}>
                            <ListItemText
                                primary={track.track.name}
                                secondary={track.track.artists
                                    .map((artist: { name: string }) => artist.name)
                                    .join(", ")}
                            />
                        </ListItem>
                    ))}
                </List>
            )}
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    if (!(await isAuthenticated(session))) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    const playlistsResponse = await customGet(
        "https://api.spotify.com/v1/me/playlists",
        session
    );
    const playlists = playlistsResponse.items || [];

    return { props: { playlists } };
};
