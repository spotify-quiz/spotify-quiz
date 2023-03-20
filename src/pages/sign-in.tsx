import { SignIn, useUser } from '@clerk/clerk-react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from '../styles/Login.module.css';

export default function LoginPage() {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/playlist-selection');
    }
  }, [user, router]);

  return (
    <div className={styles.container}>
      <SignIn />
    </div>
  );
}
