import React from "react";
import { Inter } from 'next/font/google'
import { useSession, signIn, signOut } from "next-auth/react"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { data: session, status } = useSession()
  if(session) {
    return (
      <div className='flex items-center justify-center h-screen gap-4 p-4 py-16'>
        <div className='m-auto'>
          <h1>
          Signed in as {session.user!.email}
          </h1>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex items-center justify-center h-screen gap-4 p-4 py-16'>
      <div className='m-auto'>
        <button
          className='flex sm:inline-flex justify-center items-center bg-gradient-to-tr from-green-500 to-emerald-400 hover:from-green-600 hover:to-emerald-500 active:from-green-700 active:to-emerald-600 focus-visible:ring ring-green-300 text-neutral-800 font-semibold text-center rounded-md outline-none transition duration-100 px-5 py-2'
          onClick={() => signIn("spotify")}
        >
          Sign in with Spotify
        </button>
      </div>
    </div>
  )
}