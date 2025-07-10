'use client';

import { useEffect, useState } from 'react';

import styles from './apod.module.css';

interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: 'image' | 'video';
}

export default function Apod() {
  const [apod, setApod] = useState<ApodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApod() {
      try {
        const response = await fetch('/api/apod');
        if (!response.ok) {
          throw new Error('Failed to fetch NASA APOD data');
        }
        const data: ApodData = await response.json();
        setApod(data);
      } catch (error: unknown) {
        if (error instanceof Error) setError(error.message);
        else setError('Unknown error fetching NASA APOD data');
      } finally {
        setLoading(false);
      }
    }
    fetchApod();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!apod) return <p>No data</p>;

  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Astronomy Picture of the Day</h1>
      <div className={styles.grid}>
        <div className={styles.imageContainer}>
          {apod.media_type === 'image' ? (
            <img src={apod.url} alt={apod.title} />
          ) : (
            <iframe
              src={apod.url}
              title={apod.title}
              allow="fullscreen"
              allowFullScreen
              frameBorder="0"
            />
          )}
        </div>
        <div className={styles.textContainer}>
          <h2>{apod.date}</h2>
          <h3 className={styles.subheading}>{apod.title}</h3>
          <p>{apod.explanation}</p>
        </div>
      </div>
    </main>
  );
}
