'use client';

import { useParams } from 'next/navigation';

import CameraChart from '@/features/mars-rovers/chart/CameraChart';
import CameraTable from '@/features/mars-rovers/table/CameraTable';

import styles from './page.module.css';

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getRoverName(param?: string | string[]): string {
  return Array.isArray(param) ? param[0] : (param ?? 'Unknown');
}

function CameraDataPage() {
  const { rover } = useParams();

  const rawName = getRoverName(rover);
  const roverName = capitalize(rawName);
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

export default CameraDataPage;
