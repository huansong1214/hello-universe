import ApodCalendar from '@/components/ApodCalendar/ApodCalendar';

import styles from './apod-calendar.module.css';

export default function ApodCalendarPage() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Astronomy Picture of the Day</h1>
      <div className={styles.calendarContainer}>
        <ApodCalendar />
      </div>
    </main>
  );
}