'use client';

import { useEffect, useState } from 'react';

import { FlipCard } from '@/components/FlipCard/FlipCard';

import styles from './rovers.module.css';

type ManifestData = {
  photo_manifest: {
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
    max_sol: number;
    max_date: string;
    total_photos: number;
  };
};

export default function Rovers() {
  const [manifest, setManifest] = useState<ManifestData | null>(null);

  useEffect(() => {
    async function fetchManifest() {
      try {
        const response = await fetch('api/rovers/perseverance/manifest');
        const data = await response.json();
        setManifest(data);
      } catch (error) {
        console.error('Error fetching manifest:', error);
      }
    }

    fetchManifest();
  }, []);

  const backContent = manifest ? (
    <div>
      <h3>{manifest.photo_manifest.name}</h3>
      <p>Status: {manifest.photo_manifest.status}</p>
      <p>Launch: {manifest.photo_manifest.launch_date}</p>
      <p>Landing: {manifest.photo_manifest.landing_date}</p>
      <p>Photos: {manifest.photo_manifest.total_photos.toLocaleString()}</p>
    </div>
  ) : (
    <div>Loading...</div>
  );

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Mars Rovers</h1>
      <div className={styles.grid}>
        <FlipCard
          frontContent={
            <div className={styles.imageContainer}>
              <div className={styles.roverName}>Perseverance</div>
              <img src='/images/rover-perseverance.jpg' alt='Mars Rover Perseverance' />
            </div>
          }
          backContent={backContent}
        />
      </div>
    </main>
  );
}
