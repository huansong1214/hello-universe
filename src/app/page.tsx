import { VideoDisplay } from '@/features/whats-up/VideoDisplay';

import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <VideoDisplay />
    </main>
  );
}
