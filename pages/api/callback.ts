import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;
const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  const code = req.query.code as string;

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString('base64')}`,
        },
      }
    );

    const { access_token, expires_in, refresh_token } = response.data;
    // Save the tokens to the session or a cookie, depending on your preference.
    // In this example, we'll save them to a cookie.
    const maxAge = parseInt(expires_in) - 60;

    res.setHeader('Set-Cookie', [
      `access_token=${access_token}; Max-Age=${maxAge}; Path=/; HttpOnly`,
      `refresh_token=${refresh_token}; Max-Age=${
        30 * 24 * 60 * 60
      }; Path=/; HttpOnly`,
    ]);

    res.redirect('/SelectPage');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error exchanging authorization code for tokens');
  }
};

export default callback;
