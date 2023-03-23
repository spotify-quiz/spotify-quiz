// utils/customGet.ts

import { MySession } from '../types/types';
import { refreshAccessToken } from './refreshAccessToken';

export const customGet = async (url: string, session: MySession | null) => {
  console.log('getting profile')
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${session?.user?.accessToken}`,
    },
  });

  if (response.status === 401) { // If the response status is 401 (Unauthorized)
    const newAccessToken = await refreshAccessToken(session?.user?.refreshToken);

    if (newAccessToken) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user.accessToken = newAccessToken;

      // Retry the request with the new access token
      const retryResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      // If the retry is successful, return the JSON response
      if (retryResponse.ok) {
        return retryResponse.json();
      }
    }
  } else if (response.ok) { // If the initial response is successful
    return response.json();
  }

  // If none of the above conditions are met, throw an error
  throw new Error('Error fetching data from the API');
};
