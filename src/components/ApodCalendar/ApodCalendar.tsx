'use client';

import React, { useState, useEffect, useCallback } from "react";
import Calendar from "react-calendar";

import { useApodCalendarData } from './useApodCalendarData';
import Modal from './Modal';

import styles from './ApodCalendar.module.css';

interface Apod {
  media_type: 'image' | 'video' | 'other';
  url?: string;  // 'other' media type may not have a url
  date: string;
  title: string;
  explanation: string;
};

export default function ApodCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApod, setSelectedApod] = useState<Apod | null>(null);

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

  const openModal = (date: Date) => {
    const apod = getApodForSelectedDate(date);
    if (apod) {
      setSelectedApod(apod);
      setIsModalOpen(true);
    }
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedApod(null);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  }, [closeModal]);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, handleKeyDown]);

  return (
    <div>
      {isLoading && <p className={styles.loading}>Loading APOD data...</p>}
      {error && <p className={styles.error}>{error}</p>}

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
            <div className={styles.tileImage} onClick={() => openModal(date)}>
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
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          apod={selectedApod}
        />
      )}
    </div>
  );
}
