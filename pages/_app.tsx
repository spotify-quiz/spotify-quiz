import { SessionProvider } from 'next-auth/react';

import '../styles/globals.css';
import '../styles/App.css';
import '../styles/index.css';
import '../styles/QuizPage.css';
import '../styles/AudioPlayer.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
