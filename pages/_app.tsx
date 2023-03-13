import { SessionProvider } from "next-auth/react"
import '../styles/globals.css'

import type { AppProps } from "next/app"
import type { Session } from "next-auth"

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  return (
    <div className='bg-neutral-700'>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </div>
  )
}

export default App