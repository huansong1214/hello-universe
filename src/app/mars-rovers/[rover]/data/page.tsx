'use client';

import { useParams } from 'next/navigation';

import { CameraChart } from '@/features/mars-rovers/chart/CameraChart';
import { CameraTable } from '@/features/mars-rovers/table/CameraTable';

import styles from './page.module.css';

// Title case helper for potential multi-word names like "Rosalind Franklin"
function titleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper to get a single string from a URL param that might be string, string[] or undefined
function getRoverName(param?: string | string[]): string {
  return Array.isArray(param) ? param[0] : (param ?? 'Unknown');
}

export default function CameraDataPage() {
  const { rover } = useParams();
  const rawName = getRoverName(rover);
  const roverName = titleCase(rawName);
  const roverKey = rawName.toLowerCase();

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading1}>Camera Usage for Rover {roverName}</h1>
      <CameraChart rover={roverKey} />

      <h2 className={styles.heading2}>Camera Table for Rover {roverName}</h2>
      <CameraTable rover={roverKey} />
    </main>
  );
}
