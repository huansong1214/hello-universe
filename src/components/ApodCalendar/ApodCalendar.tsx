'use client';

import { useEffect, useState } from "react";

import Calendar from "react-calendar";

import styles from './ApodCalendar.module.css';

interface ApodData {
  date: string;
  explanation: string;
  title: string;
  url: string;
  media_type: 'image' | 'video';
}

interface CalendarData {
  [date: string]: ApodData;
}

export default function ApodCalendar() {
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());

  const [error, setError] = useState<string | null>(null);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  useEffect(() => {
    async function fetchApodData() {
      const today = new Date();

      // if activeStartDate is in the future month, skip fetching
      if (
        activeStartDate.getFullYear() > today.getFullYear() ||
        (activeStartDate.getFullYear() === today.getFullYear() &&
        activeStartDate.getMonth() > today.getMonth())
      ) {
        setCalendarData({});
        setError(null);
        return;
      }

      try {
        const year = activeStartDate.getFullYear();
        const month = activeStartDate.getMonth();

        const startDate = new Date(year, month, 1);
        let endDate = new Date(year, month + 1, 0);

        // if current month, endDate should be today
        if (
          year === today.getFullYear() &&
          month === today.getMonth() &&
          today < endDate
        ) {
          endDate = today;
        }

        const startStr = formatDate(startDate);
        const endStr = formatDate(endDate);

        const response = await fetch(`/api/apod?start_date=${startStr}&end_date=${endStr}`);
        if (!response.ok) {
          throw new Error('Failed to fetch NASA APOD data');
        }

        const apods: ApodData[] = await response.json();

        const data: CalendarData = {};
        for (const apod of apods) {
          data[apod.date] = apod;
        }

        setCalendarData(data);
        setError(null);
      } catch (error) {
        console.error(error);
        setError('Failed to load NASA APOD data');
      }
    }

    fetchApodData();
  }, [activeStartDate]);

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
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return calendarData[dateString];
  };

  const selectedApod = getApodForSelectedDate(selectedDate);

  return (
    <div>
      {error && <p>{error}</p>}

      <Calendar
        className={styles.reactCalendar}
        onChange={handleDateChange}
        value={selectedDate}
        selectRange={false}

        onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setActiveStartDate(activeStartDate)}

        tileContent={({ date }) => {
          const dateString = date.toISOString().split('T')[0];
          const apod = calendarData[dateString];
          return apod ? (
            <div className={styles.tileImage}>
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
