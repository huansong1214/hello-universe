'use client';

import { useParams } from "next/navigation";

import CameraChart from "features/mars-rovers/chart/CameraChart";
import CameraTable from "features/mars-rovers/table/CameraTable";

import styles from './page.module.css';

// capitalize first letter of rover name
function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// helper to get a single string from param that might be string | string[] | undefined
function getRoverName(param: string | string[] | undefined): string {
    if (Array.isArray(param)) return param[0]; // pick the first element if it's an array
    return param || 'Unknown'; // return the param if it exists, else return 'Unknown'
}

function CameraUsagePage() {
  const { rover } = useParams(); // grab the rover param from the URL

  const rawName = getRoverName(rover);
  const roverName = capitalize(rawName);

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Camera Usage for Rover {roverName}</h1>
      <CameraChart rover={rawName.toLowerCase()} />
      <h2>Camera Table for Rover {roverName}</h2>
      <CameraTable rover={rawName.toLowerCase()} />
    </main>
  );
}

export default CameraUsagePage;
