import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
  console.log('callback');
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.split('=')[1];
      localStorage.setItem('access_token', token);
      router.push('/select-playlist');
    }
  }, []);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}
