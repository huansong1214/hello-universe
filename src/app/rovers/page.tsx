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

const rovers = ['perseverance', 'curiosity', 'opportunity', 'spirit'];

export default function Rovers() {
  const [manifests, setManifests] = useState<ManifestData[]>([]);

  useEffect(() => {
    async function fetchManifests() {
      try {
        const responses = await Promise.all(
          rovers.map(rover =>
            fetch(`api/rovers/${rover}/manifest`).then(res => res.json())
          )
        );
        setManifests(responses);
      } catch (error) {
        console.error('Error fetching manifests:', error);
      }
    }

    fetchManifests();
  }, []);

  if (manifests.length === 0) {
    return (
      <main className={styles.mainContainer}>
        <h1 className={styles.heading}>Mars Rovers</h1>
        <div className={styles.grid}>
          <p>Loading rover data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Mars Rovers</h1>
      <div className={styles.grid}>
        {manifests.map((manifest) => {
          if (!manifest.photo_manifest) return null;

          return (
            <FlipCard
              key={manifest.photo_manifest.name}
              frontContent={
                <div className={styles.imageContainer}>
                  <div className={styles.roverName}>{manifest.photo_manifest.name}</div>
                  <img
                    src={`/images/rover-${manifest.photo_manifest.name.toLowerCase()}.jpg`}
                    alt={`Mars Rover ${manifest.photo_manifest.name}`}
                  />
                </div>
              }
              backContent={
                <div>
                  <h3>{manifest.photo_manifest.name}</h3>
                  <p>Status: {manifest.photo_manifest.status}</p>
                  <p>Launch: {manifest.photo_manifest.launch_date}</p>
                  <p>Landing: {manifest.photo_manifest.landing_date}</p>
                  <p>Photos: {manifest.photo_manifest.total_photos.toLocaleString()}</p>
                </div>
              }
            />
          );
        })}
      </div>
    </main>
  );
}
