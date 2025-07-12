'use client';

import {useState } from "react";

import Calendar from "react-calendar";

import { useApodCalendarData } from './useApodCalendarData';

import styles from './ApodCalendar.module.css';

export default function ApodCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());

  const { calendarData, error, isLoading } = useApodCalendarData(activeStartDate);

  type CalendarValue = Date | [Date | null, Date | null] | null;

  const handleDateChange = (value: CalendarValue) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value)) {
      const start = value[0];
      if (start instanceof Date) {
        setSelectedDate(start);
      }
    }
  };

  const getApodForSelectedDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return calendarData[dateString];
  };

  const selectedApod = getApodForSelectedDate(selectedDate);

  return (
    <div>
      {isLoading && <p className={styles.loading}>Loading APOD data...</p>}
      {error && <p>{error}</p>}

      <Calendar
        className={styles.reactCalendar}
        onChange={handleDateChange}
        value={selectedDate}
        selectRange={false}
        view='month'
        minDetail='month'
        maxDetail='month'
        onActiveStartDateChange={({ activeStartDate }) =>
          activeStartDate && setActiveStartDate(activeStartDate)
        }

        tileContent={({ date }) => {
          const dateString = date.toISOString().split('T')[0];
          const apod = calendarData[dateString];
          return apod ? (
            <div className={styles.tileImage}>
              <span className={styles.dateOverlay}>{date.getDate()}</span>
              <img
                src={apod.url}
                alt={apod.title}
                className={styles.thumbnail} />
            </div>
          ) : null;
        }}
      />

      {selectedApod && (
        <div className={styles.apodDetails}>
          <h2>{selectedApod.title}</h2>
          <p>{selectedApod.explanation}</p>
          {selectedApod.media_type === 'image' && (
            <img src={selectedApod.url} alt={selectedApod.title} />
          )}
          {selectedApod.media_type === 'video' && (
            <iframe
              src={selectedApod.url}
              title={selectedApod.title}
              allow='fullscreen'
              allowFullScreen
            />
          )}
        </div>
      )}
    </div>
  );
}
