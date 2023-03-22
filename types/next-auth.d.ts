// types/next-auth.d.ts

import { Session } from 'next-auth';
// types/next-auth.d.ts

import { Session, JWT } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    callbackUrl?: string;
    user?: {
      JWT: any;
      accessToken: string;
      refreshToken: string;
    };
  }

  interface JWT {
    refreshToken: string;
  }
}
