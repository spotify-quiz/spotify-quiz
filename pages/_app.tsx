import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import "../styles/globals.css"


import { SpotifyProvider } from "@/context/SpotifyContext";


function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <SessionProvider session={pageProps.session}>
            <SpotifyProvider>

                    {router.pathname === "/select" ? (
                        <Component {...pageProps} />
                    ) : (
                        <>

                            <div className="flex flex-col ml-64">

                                <main className="mt-4 ml-4">
                                    <Component {...pageProps} />
                                </main>
                            </div>

                        </>
                    )}

            </SpotifyProvider>
        </SessionProvider>
    );
}

export default MyApp;