import { useEffect, useState, useRef } from 'react';

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

interface CachedMonth {
  data: CalendarData;
  timestamp: number;
}

// Helper: format Date to 'YYYY-MM-DD' string.
const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Helper: create key for month cache in format 'YYYY-MM'.
const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

// Custom hook to fetch and cache NASA APOD data by month.
// Uses in-memory and localStorage caching with 1-day expiration.
// Debounces fetches and handles component unmounts safely.
export function useApodCalendarData(activeStartDate: Date) {
  // State: APOD data for calendar dates keyed by date string.
  const [apodCalendarData, setApodCalendarData] = useState<CalendarData>({});

  // Ref: cache of monthly data with timestamp to avoid unnecessary fetches.
  const cacheRef = useRef<Record<string, CachedMonth>>({});

  // State: error message if fetch fails.
  const [error, setError] = useState<string | null>(null);

  // State: loading indicator for fetch status.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Ref: track component mounted state to avoid state updates after unmount.
  const isMounted = useRef(true);

  // Load cached data from localStorage once on mount.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('apodCache');
        if (stored) {
          cacheRef.current = JSON.parse(stored);
        }
      } catch (err) {
        console.warn('Failed to parse APOD cache from local Storage:', err);
      }
    }

    // Cleanup: mark component as unmounted.
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Effect: refetch or load cached data whenever activeStartDate changes.
  useEffect(() => {
    const today = new Date();
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth();
    const monthKey = getMonthKey(activeStartDate);

    const cachedMonth = cacheRef.current[monthKey];
    const now = Date.now();

    // Cache expiration: 1 day in milliseconds.
    const EXPIRATION_MS = 24 * 60 * 60 * 1000;

    // Early return: if the requested month is in the future, clear data and stop.
    if (
      year > today.getFullYear() ||
      (year === today.getFullYear() && month > today.getMonth())
    ) {
      setApodCalendarData({});
      setError(null);
      setIsLoading(false);
      return;
    }

    // Determine if requested month is the current calendar month.
    const isCurrentMonth =
      year === today.getFullYear() && month === today.getMonth();

    // Check if cached data is valid.
    // If not current month, any cache is valid.
    // If current month, cache must be less than 1 day old.
    const isCacheValid =
      cachedMonth &&
      (!isCurrentMonth || now - cachedMonth.timestamp < EXPIRATION_MS);

    if (isCacheValid) {
      // Use cached data immediately without fetching.
      console.log(`[Cache] Using cached data for ${monthKey}.`);
      setApodCalendarData(cachedMonth.data);
      setError(null);
      setIsLoading(false);

      return;
    }

    // Debounce fetch to avoid rapid requests when activeStartDate changes quickly.
    const timeout = setTimeout(() => {
      async function fetchApodData() {
        if (!isMounted.current) return; // Do nothing if component unmounted.

        setIsLoading(true);

        try {
          // Caculate start and end date strings for fetch query.
          const startDate = new Date(year, month, 1);
          let endDate = new Date(year, month + 1, 0);

          // For current month, do not request dates after today.
          if (isCurrentMonth && today < endDate) endDate = today;

          const startStr = formatDate(startDate);
          const endStr = formatDate(endDate);

          console.log(`[Fetch] Fetching data for ${monthKey}.`);

          // Fetch APOD data for the month from API endpoint.
          const response = await fetch(
            `/api/apod?start_date=${startStr}&end_date=${endStr}`,
          );

          if (!response.ok) throw new Error('Failed to fetch APOD data.');

          const apods: ApodData[] = await response.json();

          // Convert array to date-keyed object for easy lookup
          const data: CalendarData = {};
          for (const apod of apods) {
            data[apod.date] = apod;
          }

          if (!isMounted.current) return;

          // Update state with fetched data.
          setApodCalendarData(data);

          // Update cache and persist to localStorage.
          cacheRef.current[monthKey] = { data, timestamp: Date.now() };

          try {
            localStorage.setItem('apodCache', JSON.stringify(cacheRef.current));
          } catch (err) {
            console.warn('Failed to save APOD cache to localStorage:', err);
          }

          setError(null);
        } catch (err) {
          if (!isMounted.current) return;

          console.error(err);
          setError('Failed to load APOD data.');
        } finally {
          if (!isMounted.current) return;
          setIsLoading(false);
        }
      }

      fetchApodData();
    }, 200); // 200ms debounce delay

    // Cleanup: clear timeout if effect re-runs or component unmounts
    return () => clearTimeout(timeout);
  }, [activeStartDate]);

  // Return current calendar data, loading, and error states.
  return { calendarData: apodCalendarData, error, isLoading };
}
