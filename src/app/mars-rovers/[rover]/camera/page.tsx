'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import styles from './page.module.css';

function CameraUsagePage() {
  const { rover } = useParams(); // grab the rover param from the URL
  const [roverName, setRoverName] = useState('');

  // capitalize first letter of rover name
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // helper to get a single string from param that might be string | string[] | undefined
  const getRoverName = (param: string | string[] | undefined): string => {
    if (Array.isArray(param)) return param[0]; // pick the first element if it's an array
    return param || 'Unknown'; // return the param if it exists, else return 'Unknown'
  }

  useEffect(() => {
    const rawName = getRoverName(rover); // make sure to get a single string
    setRoverName(capitalize(rawName)); // set the capitalized rover name
  }, [rover]);

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Camera Usage for Rover {roverName}</h1>
      {/* TODO: render chart here */}
    </main>
  );
}

export default CameraUsagePage;
