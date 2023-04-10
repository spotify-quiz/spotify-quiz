import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import QuizPage from './QuizPage';
import { Item, Quiz, Song, Track, Image } from '../types/MockQuizObjects';
import axios from 'axios';
import shuffle from '@/utils/shuffleSong';

interface Props {
  accessToken: string | null;
}

function RenderQuiz({ accessToken }: Props) {
  const router = useRouter();
  const { playlistId, timeLimit, numQuestions } = router.query;
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const timeLimitNum: number = parseInt(timeLimit as string, 10)
  const numQuestionsNum: number = parseInt(numQuestions as string, 10)

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) {
        return;
      }

      try {
        let response;
        if (accessToken) {
          response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
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

          const tokenResponse = await axios(authOptions);
          const token = tokenResponse.data.access_token;
          response = await axios.get(
            `https://api.spotify.com/v1/playlists/${playlistId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        const playlist = response.data;
        const tracks: Track[] = playlist.tracks.items
          .filter((item: any) => item.track.preview_url != null)
          .map((item: any) => {
            const images = item.track.album.images.map(
              (image: any) => new Image(image.url, image.width, image.height)
            );
            const song = new Song(
              item.track.name,
              images,
              item.track.preview_url,
              item.track.artists[0].name,
              item.track.album.name
            );
            return new Track(song);
          });

        const item = new Item(tracks);
        const image = playlist.images.length
          ? new Image(
              playlist.images[0].url,
              playlist.images[0].width,
              playlist.images[0].height)
          : new Image('', 0, 0);
        const fetchedQuiz = new Quiz(playlist.name, image, item);

        // shuffle songs
        fetchedQuiz.tracks.items = shuffle(fetchedQuiz.tracks.items);
        const _ = fetchedQuiz.tracks.items.slice(0, numQuestionsNum)

        setQuiz(fetchedQuiz);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPlaylist();
  }, [playlistId, accessToken]);

  return quiz ? (
    <QuizPage quiz={quiz} timeLimit={timeLimitNum} numQuestions={numQuestionsNum} />
  ) : (
    <p>Loading...</p>
  );
}

export default RenderQuiz;
