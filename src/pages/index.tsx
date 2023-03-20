import { useRouter } from 'next/router';
import { useEffect } from 'react';

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/sign-in');
  }, [router]);

  return null;
};

export default HomePage;
