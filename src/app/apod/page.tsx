export const dynamic = 'force-dynamic'; // force server fetch on every request

import styles from './apod.module.css';

interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: 'image' | 'video'; // add media_type
}

const NASA_API_KEY = process.env.NASA_API_KEY;

if (!NASA_API_KEY) {
  throw new Error('Missing NASA_API_KEY environment variable');
}

export default async function Apod() {
  const response = await fetch(
    `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
    { cache: 'no-store' } // also ensure no caching
  );

  if (!response.ok) {
    throw new Error('Failed to fetch NASA APOD data');
  }

  const apod: ApodData = await response.json();

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
