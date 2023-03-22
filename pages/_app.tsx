import { SessionProvider } from 'next-auth/react';

import '../styles/globals.css'
import '../styles/App.css'
import '../styles/index.css'
import '../styles/QuizPage.css'
import '../styles/AudioPlayer.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { AppProps } from 'next/app'

import { SpotifyProvider } from '../context/SpotifyContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <SpotifyProvider>
        <Component {...pageProps} />
      </SpotifyProvider>
    </SessionProvider>
  );
}

export default MyApp;
