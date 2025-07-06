import Image from 'next/image';

import { FlipCard } from '@/components/FlipCard/FlipCard';

import styles from './rovers.module.css';

export default function Rovers() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Mars Rovers</h1>
      <div className={styles.grid}>
        <div>Perseverance</div>
        <FlipCard
          frontContent={
            <div>
              <Image
                src='/images/rover-perseverance.jpg'
                alt='Mars Rover Perseverance'
                fill
              />
            </div>
          }
          backContent={<div>Back</div>}
        />
      </div>
    </main>
  );
}
