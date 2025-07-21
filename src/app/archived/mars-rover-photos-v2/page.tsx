'use client';

import { useEffect, useState } from "react";

import FilterButtons from '@/components/MarsRoverPhotos/FilterButtons';
import RoverCard from '@/components/MarsRoverPhotos/RoverCard';

import styles from './mars-rover-photos.module.css';

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

export default function MarsRoverPhotosPage() {
  const [manifests, setManifests] = useState<ManifestData[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'complete'>('all');

  useEffect(() => {
    const CACHE_KEY = 'roverManifestsCache';
    const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day

    async function fetchManifests() {
      const cached = localStorage.getItem(CACHE_KEY);

      if(cached) {
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
        <h1 className={styles.heading}>Mars Rover Photos</h1>
        <div className={styles.grid}>
          <p className={styles.loading}>Loading rover data...</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Mars Rover Photos</h1>

      <FilterButtons filterStatus={filterStatus} onChange={setFilterStatus} />

      <div className={styles.grid}>
        {filteredManifests.map((manifest) => {
          if (!manifest.photo_manifest) return null;

          const { name, status, launch_date, landing_date, total_photos } = manifest.photo_manifest;

          return (
            <RoverCard
              key={name}
              name={name}
              status={status}
              launchDate={launch_date}
              landingDate={landing_date}
              totalPhotos={total_photos}
            />
          );
        })}
      </div>
    </main>
  );
}
