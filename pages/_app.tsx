import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../styles/globals.css";

import { SpotifyProvider } from "@/context/SpotifyContext";

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
