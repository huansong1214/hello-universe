import ApodCalendar from '@/features/apod-calendar/ApodCalendar';

import styles from './page.module.css';

export default function ApodCalendarPage() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading1}>Astronomy Picture of the Day</h1>
      <div className={styles.calendarContainer}>
        <ApodCalendar />
      </div>
    </main>
  );
}
