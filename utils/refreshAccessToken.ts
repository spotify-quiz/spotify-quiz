export const refreshAccessToken = async (
    refreshToken: string | null | undefined
): Promise<string> => {
    if (!refreshToken) {
        throw new Error('Refresh token is not provided');
    }

    try {
        const tokenResponse = await fetch(
            'https://accounts.spotify.com/api/token',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
                    ).toString('base64')}`,
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: refreshToken,
                }).toString(),
            }
        );

        const tokenData = await tokenResponse.json();

        return tokenData.access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
};
