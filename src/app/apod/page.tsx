import ApodCalendar from 'features/apod-calendar/components/ApodCalendar';

import styles from './page.module.css';

export default function ApodPage() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Astronomy Picture of the Day</h1>
      <div className={styles.calendarContainer}>
        <ApodCalendar />
      </div>
    </main>
  );
}
