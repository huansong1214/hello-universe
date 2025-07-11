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

  // cache to store previously fetched month data keyed by "YYYY-MM"
  const [cache, setCache] = useState<Record<string, CalendarData>>({});

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // formal full date as "YYYY-MM-DD"
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  // format month as "YYYY-MM"
  const getMonthKey = (date: Date) =>
    `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

  useEffect(() => {
    // debounce fetch: wait 500ms before triggering fetch
    const debounceTimeout = setTimeout(() => {
      const today = new Date();
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth();
      const monthKey = getMonthKey(activeStartDate);

      // if data is already cached for this month, use it directly
      if (cache[monthKey]) {
        console.log(`[Cache] Using cached data for ${monthKey}`);
        setCalendarData(cache[monthKey]);
        setError(null);
        return;
      }

      // skip fetching if viewing a future month
      if (
        year > today.getFullYear() ||
        (year === today.getFullYear() && month > today.getMonth())
      ) {
        setCalendarData({});
        setError(null);
        return;
      }

      async function fetchApodData() {
        try {
          const startDate = new Date(year, month, 1);
          let endDate = new Date(year, month + 1, 0);

          // restrict endDate to today if viewing the current month
          if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            today < endDate
          ) {
            endDate = today;
          }

          const startStr = formatDate(startDate);
          const endStr = formatDate(endDate);

          console.log(`[Fetch] Fetching data for ${monthKey}`);
          const response = await fetch(`/api/apod?start_date=${startStr}&end_date=${endStr}`);
          if (!response.ok) {
            throw new Error('Failed to fetch NASA APOD data');
          }

          const apods: ApodData[] = await response.json();
          const data: CalendarData = {};
          for (const apod of apods) {
            data[apod.date] = apod;
          }

          // store data in both calendar state and cache
          setCalendarData(data);
          setCache(prev => ({ ...prev, [monthKey]: data }));
          setError(null);
        } catch (error) {
          console.error(error);
          setError('Failed to load NASA APOD data');
        }
      }

      fetchApodData();
    }, 500); // 500ms debounce delay

    // clear timeout on effect cleanup to prevent overlapping fetches
    return () => clearTimeout(debounceTimeout);
  }, [activeStartDate, cache]);

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

        view='month'
        minDetail='month'
        maxDetail='month'

        onActiveStartDateChange={({ activeStartDate }) => activeStartDate && setActiveStartDate(activeStartDate)}

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
