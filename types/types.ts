import { DefaultSession } from 'next-auth';

interface MyUser {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  image?: string | null;
  accessToken?: string | null;

  refreshToken?: string | null;



}

export interface MySession extends Omit<DefaultSession, 'user'> {
  user?: MyUser;
  expires: string;
  refreshToken?: string; // Add this line to include the refreshToken property
}

interface Image {
  height: number | null;
  url: string | null;
  width: number | null;
}

export interface Track {
  id: string;
  name: string;
  duration_ms: number;
  preview_url: string;
}

export interface PlaylistType {
  description?: string;
  id: string;
  followers?: {
    total?: number;
  };
  images?: [Image];
  name: string;
  owner?: {
    id: string;
    display_name?: string;
  };
  items?: [{ added_at: string; track: Track }];
  tracks?: {
    items?: [{ added_at: string; track: Track }];
    total: number;
  };
  type?: string;
  total?: number;
}
