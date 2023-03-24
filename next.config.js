/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'wilcity.com',
      'i.scdn.co',
      'platform-lookaside.fbsbx.com',
      'img.icons8.com',
    ],
  },
  env: {
    SPOTIFY_CLIENT_ID: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    SPOTIFY_REDIRECT_URI: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
  },
};

module.exports = nextConfig;
