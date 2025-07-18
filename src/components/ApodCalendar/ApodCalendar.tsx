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

      {!isLoading && Object.keys(calendarData).length > 0 && (
        <Calendar
          className={styles.reactCalendar}
          onChange={handleDateChange}
          value={selectedDate}
          selectRange={false}
          view='month'
          minDetail='month'
          maxDetail='month'
          // set minDate to 2015-01-01 (start of APOD archive)
          minDate={new Date(2015, 0, 1)}
          // set maxDate to the last day of the current month
          maxDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)}
          onActiveStartDateChange={({ activeStartDate }) =>
            activeStartDate && setActiveStartDate(activeStartDate)
          }

          tileDisabled={({ date }) => {
            const dateString = date.toISOString().split('T')[0];
            return !calendarData[dateString];
          }}

          tileContent={({ date }) => {
            const dateString = date.toISOString().split('T')[0];
            const apod = calendarData[dateString];
            if (!apod) return null;

            // conditionally render thumbnail based on media type
            const isImage = apod.media_type === 'image';
            const isVideo = ['video', 'other'].includes(apod.media_type);

            return (
              <div className={styles.tileImage}>
                <span className={styles.dateOverlay}>{date.getDate()}</span>

                <div
                  className={styles.thumbnailContainer}
                  onClick={() => openModal(date)}
                >
                  {isImage && (
                    <img
                    src={apod.url}
                    alt={apod.title}
                    className={styles.thumbnail}
                    loading='lazy'
                    />
                  )}
                  {isVideo && (
                    <div className={styles.playOverlay}>▶</div>
                  )}
                </div>
              </div>
            );
          }}
        />
      )}

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
