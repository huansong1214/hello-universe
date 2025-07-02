export const dynamic = 'force-dynamic'; // forces server fetch on every request

import styles from './apod.module.css';

interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
}

export default async function Apod() {
  const apiKey = process.env.NASA_API_KEY;

  const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch NASA APOD data");
  }

  const apod: ApodData = await response.json();

  return (
    <main>
      <h1 className={styles.heading}>Astronomy Picture of the Day</h1>
      <div className={styles.grid}>
        <div className={styles.imageContainer}>
          <img src={apod.url} alt={apod.title} />
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
