// utils/customGet.ts

import { MySession } from '../types/types';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const customGet = async (url: string, session: MySession | null) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  return response.json();
};
