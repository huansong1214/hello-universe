'use client';

import { useEffect, useState } from 'react';

import { FlipCard } from '@/components/FlipCard/FlipCard';

import styles from './rovers.module.css';

import { Button } from '@/components/ui/button';

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
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'complete'>('all');

  useEffect(() => {
    const CACHE_KEY = 'roverManifestsCache';
    const EXPIRATION_MS = 1000 * 60 * 60 * 24; // 1 day

    async function fetchManifests() {
      const cached = localStorage.getItem(CACHE_KEY);

      if (cached) {
        try {
          const { timestamp, data } = JSON.parse(cached);
          if (Date.now() - timestamp < EXPIRATION_MS) {
            setManifests(data);
            return;
          }
        } catch (error) {
          console.warn('Failed to parse cached data:', error);
          localStorage.removeItem(CACHE_KEY); // clear corrupted cache
        }
      }

      try {
        const responses = await Promise.all(
          rovers.map((rover) =>
            fetch(`api/rovers/${rover}/manifest`).then((response) => response.json()),
          ),
        );

        setManifests(responses);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: responses }),
        );
      } catch (error) {
        console.error('Error fetching mission manifests:', error);
      }
    }

    fetchManifests();
  }, []);

  // filter manifests only if filterStatus is not 'all'
  const filteredManifests =
    filterStatus === 'all'
      ? manifests
      : manifests.filter(
          (manifest) =>
            manifest.photo_manifest?.status.toLowerCase() === filterStatus,
      );

  if (manifests.length === 0) {
    return (
      <main className={styles.mainContainer}>
        <h1 className={styles.heading}>Mars Rovers</h1>
        <div className={styles.grid}>
          <p className={styles.loading}>Loading rover data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Mars Rovers</h1>

      {/* filter buttons */}
      <div className={styles.filterButtons}>
        <Button active={filterStatus === 'all'} onClick={() => setFilterStatus('all')}>All</Button>
        <Button active={filterStatus === 'active'} onClick={() => setFilterStatus('active')}>Active</Button>
        <Button active={filterStatus === 'complete'} onClick={() => setFilterStatus('complete')}>Complete</Button>
      </div>

      <div className={styles.grid}>
        {filteredManifests.map((manifest) => {
          if (!manifest.photo_manifest) return null;

          return (
            <FlipCard
              key={manifest.photo_manifest.name}
              frontContent={
                <div className={styles.imageContainer}>
                  <div className={styles.roverName}>
                    {manifest.photo_manifest.name}
                  </div>
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
                  <p>
                    Photos:{' '}
                    {manifest.photo_manifest.total_photos.toLocaleString()}
                  </p>
                </div>
              }
            />
          );
        })}
      </div>
    </main>
  );
}
