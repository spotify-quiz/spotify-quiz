import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import QuizPage from './QuizPage';
import { customGet } from '../utils/customGet';
import { Item, Quiz, Song, Track, Image } from '../types/MockQuizObjects';

function RenderQuiz() {
    const { data: session } = useSession();
    const router = useRouter();
    const { playlistId } = router.query;
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        async function fetchData() {
            if (!playlistId || !session) {
                return;
            }

            const playlist = await customGet(
                `https://api.spotify.com/v1/playlists/${playlistId}`,
                session
            );

            const tracks: Track[] = playlist.tracks.items.map((item: any) => {
                const images = item.track.album.images.map(
                    (image: any) => new Image(image.url, image.width, image.height)
                );
                const song = new Song(
                    item.track.name,
                    images,
                    item.track.preview_url
                );
                return new Track(song);
            });

            const item = new Item(tracks);
            const image = playlist.images.length
                ? new Image(playlist.images[0].url, playlist.images[0].width, playlist.images[0].height)
                : new Image('', 0, 0);
            const fetchedQuiz = new Quiz(playlist.name, image, item);
            setQuiz(fetchedQuiz);
        }

        fetchData();
    }, [playlistId, session]);

    return quiz ? (
        <QuizPage quiz={quiz} time={60} />
    ) : (
        <p>Loading...</p>
    );
}

export default RenderQuiz;
