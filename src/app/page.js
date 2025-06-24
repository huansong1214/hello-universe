import styles from './apod.module.css';

export default async function Apod() {
  const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
  const apod = await response.json();

  return (
    <>
      <h1 className={styles.heading}>Astronomy Picture of the Day</h1>
      <main className={styles.grid}>
        <div className={styles.imageContainer}>
          <img src={apod.url} alt={apod.title}/>
        </div>
        <div className={styles.text}>
          <h2>{apod.date}</h2>
          <h3 className={styles.subheading}>{apod.title}</h3>
          <p>{apod.explanation}</p>
        </div>
      </main>
    </>

  );
}