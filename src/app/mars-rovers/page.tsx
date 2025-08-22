'use client';

import { clsx } from 'clsx';
import { useEffect, useState } from 'react';

import { FilterButtons } from '@/features/mars-rovers/manifest/FilterButtons';
import { RoverCard } from '@/features/mars-rovers/manifest/RoverCard';

import styles from './page.module.css';

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

export default function MarsRoversPage() {
  const [manifests, setManifests] = useState<ManifestData[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'complete'
  >('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const CACHE_KEY = 'roverManifestsCache';
    const EXPIRATION_MS = 24 * 60 * 60 * 1000;

    async function fetchManifests() {
      setLoading(true);

      try {
        // Try to load from cache
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < EXPIRATION_MS) {
              setManifests(data);
              setLoading(false); // Stop if cache is valid
              return;
            }
          } catch (error) {
            console.warn('Failed to parse cached data:', error);
            localStorage.removeItem(CACHE_KEY); // Remove corrupted cache
          }
        }

        // Fetch from API if no valid cache
        const responses = await Promise.all(
          rovers.map((rover) =>
            fetch(`api/mars-rovers/${rover}/manifest`).then((response) =>
              response.json(),
            ),
          ),
        );

        setManifests(responses);

        // Cache new data
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ timestamp: Date.now(), data: responses }),
        );
      } catch (error) {
        console.error('Error fetching mission manifests:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchManifests();
  }, []);

  // Render loading state
  if (loading) {
    return (
      <main className={styles.mainContainer}>
        <h1 className={styles.heading1}>Mars Rover Missions Timeline</h1>
        <div className={clsx(styles.timeline, styles.hiddenLine)}>
          <p className={styles.loading}>Loading rover data...</p>
        </div>
      </main>
    );
  }

  // Filter manifests by status
  const filteredManifests =
    filterStatus === 'all'
      ? manifests
      : manifests.filter(
          (manifest) =>
            manifest.photo_manifest?.status.toLowerCase() === filterStatus,
        );

  // Sort by landing_date (most recent first)
  const sortedManifests = filteredManifests.slice().sort((a, b) => {
    const dateA = new Date(a.photo_manifest?.landing_date || '').getTime();
    const dateB = new Date(b.photo_manifest?.landing_date || '').getTime();
    return dateB - dateA;
  });

  // Render main content
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading1}>Mars Rover Missions Timeline</h1>

      <FilterButtons filterStatus={filterStatus} onChange={setFilterStatus} />

      <div className={styles.timeline}>
        {sortedManifests.map((manifest, index) => {
          if (!manifest.photo_manifest) return null;

          const { name, status, launch_date, landing_date, total_photos } =
            manifest.photo_manifest;
          const sideClass = index % 2 === 0 ? 'left' : 'right'; // Alternate sides

          return (
            <div
              key={name}
              className={clsx(styles.timelineItem, styles[sideClass])}
            >
              <div className={styles.timelineItemContent}>
                <RoverCard
                  name={name}
                  status={status}
                  launchDate={launch_date}
                  landingDate={landing_date}
                  totalPhotos={total_photos}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
