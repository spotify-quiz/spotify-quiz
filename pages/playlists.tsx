import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const playlists = async (req: NextApiRequest, res: NextApiResponse) => {
  const accessToken = req.cookies.access_token;

  if (!accessToken) {
    res.status(401).send('Unauthorized');
    return;
  }

  try {
    const response = await axios.get(
      'https://api.spotify.com/v1/me/playlists',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const playlists = response.data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));

    res.json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching playlists');
  }
};

export default playlists;
