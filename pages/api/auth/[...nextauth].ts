import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

const scope =
  'user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative';

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET as string,
      authorization: `https://accounts.spotify.com/authorize?response_type=code&scope=${encodeURIComponent(
        scope
      )}`,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 3500,
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.id = account.id;
        token.expires_at = account.expires_at;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token; // Use "refresh_token" instead of "refreshToken"
      }
      return token;
    },
    async session({ session, user, token }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user.JWT = token;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user.accessToken = token.accessToken;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user.refreshToken = token.refreshToken; // Use "token.refreshToken" instead of "user.refreshToken"
      return session;
    },
  },
  pages: {
    signIn: '/',
  },
});
