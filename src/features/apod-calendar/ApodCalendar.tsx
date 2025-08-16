'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';

import styles from './ApodCalendar.module.css';
import Modal from './Modal';
import { useApodCalendarData } from './useApodCalendarData';


// Lazy load the Calendar component for performance.
const Calendar = React.lazy(() => import('react-calendar'));

interface Apod {
  media_type: 'image' | 'video' | 'other';
  url?: string; // 'other' media type may not have a URL
  date: string;
  title: string;
  explanation: string;
}

export default function ApodCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeStartDate, setActiveStartDate] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApod, setSelectedApod] = useState<Apod | null>(null);

  // Store new month view temporarily to prevent calendar from reverting during loading.
  const [pendingActiveStartDate, setPendingActiveStartDate] = useState<Date | null>(null);

  // Fetch calendar data for the current month.
  const { calendarData, error, isLoading } =
    useApodCalendarData(activeStartDate);

  // Type for calendar selection value (single date or date range).
  type SingleOrRangeDate = Date | [Date | null, Date | null] | null;

  // Track Calendar value changes.
  const handleDateChange = (value: SingleOrRangeDate) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (Array.isArray(value)) {
      const start = value[0];
      if (start instanceof Date) {
        setSelectedDate(start);
      }
    }
  };

  // Update activeStartDate and pendingActiveStartDate when user navigates to a new month.
  const handleActiveStartDateChange = ({
    activeStartDate,
  }: {
    activeStartDate: Date | null;
  }) => {
    if (activeStartDate) {
      // Hold this date while loading so Calendar doesn't snap back.
      setPendingActiveStartDate(activeStartDate);
      setActiveStartDate(activeStartDate);
    }
  };

  // Clear pendingActiveStartDate once calendar data has finished loading.
  useEffect(() => {
    if (!isLoading && pendingActiveStartDate) {
      setPendingActiveStartDate(null);
    }
  }, [isLoading, pendingActiveStartDate]);

  // Get APOD object for selected date.
  const getApodForSelectedDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return calendarData[dateString];
  };

  // Open modal with APOD details for the selected date.
  const openModal = (date: Date) => {
    const apod = getApodForSelectedDate(date);
    if (apod) {
      setSelectedApod(apod);
      setIsModalOpen(true);
    }
  };

  // Close modal and clear selection.
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedApod(null);
  }, []);

  // Close modal when Escape key is pressed.
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    },
    [closeModal],
  );

  // Attach and clean up Escape key event listener.
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

      {/* Only render calendar after data is loaded. */}
      {!isLoading && Object.keys(calendarData).length > 0 && (
        <Suspense
          fallback={<p className={styles.loading}>Loading APOD calendar...</p>}
        >
          <Calendar
            className={styles.reactCalendar}
            onChange={handleDateChange}
            value={selectedDate}
            selectRange={false}
            view="month"
            minDetail="month"
            maxDetail="month"
            minDate={new Date(2015, 0, 1)} // 2015-01-01
            maxDate={
              new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            } // End of current month
            onActiveStartDateChange={handleActiveStartDateChange}
            activeStartDate={pendingActiveStartDate || activeStartDate} // Prioritize pendingActiveStartDate while data is loading to prevent view reset.
            tileDisabled={({ date }) => {
              const dateString = date.toISOString().split('T')[0];
              return !calendarData[dateString];
            }}
            tileContent={({ date }) => {
              const dateString = date.toISOString().split('T')[0];
              const apod = calendarData[dateString];
              if (!apod) return null;

              // Conditionally render thumbnail based on media type.
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
                        loading="lazy"
                      />
                    )}
                    {isVideo && <div className={styles.playOverlay}>▶</div>}
                  </div>
                </div>
              );
            }}
          />
        </Suspense>
      )}

      {/* Modal to show APOD details */}
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
