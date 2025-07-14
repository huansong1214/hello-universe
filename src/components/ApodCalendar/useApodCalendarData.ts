import { useEffect, useState, useRef } from "react";

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

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

export function useApodCalendarData(activeStartDate: Date) {
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const cacheRef = useRef<Record<string, CachedMonth>>({}); // initialize cacheRef with an empty object
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isMounted = useRef(true); // track if the component is mounted

  // load cache from localStorage only once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('apodCache');
        if (stored) {
          cacheRef.current = JSON.parse(stored);
        }
      } catch (error) {
        console.warn('Failed to parse APOD cache:', error);
      }
    }

    return () => {
      isMounted.current = false; // cleanup when the component unmounts
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const year = activeStartDate.getFullYear();
    const month = activeStartDate.getMonth();
    const monthKey = getMonthKey(activeStartDate);
    const cachedMonth = cacheRef.current[monthKey];
    const now = Date.now();
    const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day

    // skip future months
    if (
      year > today.getFullYear() ||
      (year === today.getFullYear() && month > today.getMonth())
    ) {
      setCalendarData({});
      setError(null);
      setIsLoading(false);
      return;
    }

    // use cache if valid
    const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
    const isCacheValid = cachedMonth && (!isCurrentMonth || now - cachedMonth.timestamp < EXPIRATION_MS);

    if (isCacheValid) {
      console.log(`[Cache] Using cached data for ${monthKey}`);
      setCalendarData(cachedMonth.data);
      setError(null);
      setIsLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      async function fetchApodData() {
        if (!isMounted.current) return; // avoid setting state if the component is unmounted

        setIsLoading(true);
        try {
          const startDate = new Date(year, month, 1);
          let endDate = new Date(year, month + 1, 0);
          if (isCurrentMonth && today < endDate) endDate = today;

          const startStr = formatDate(startDate);
          const endStr = formatDate(endDate);

          console.log(`[Fetch] Fetching data for ${monthKey}`);
          const response = await fetch(`/api/apod?start_date=${startStr}&end_date=${endStr}`);
          if (!response.ok) throw new Error('Failed to fetch NASA APOD data');

          const apods: ApodData[] = await response.json();
          const data: CalendarData = {};
          for (const apod of apods) {
            data[apod.date] = apod;
          }

          if (!isMounted.current) return; // avoid setting state if the component is unmounted

          setCalendarData(data);

          // update the cache and save it to localStorage
          cacheRef.current = {
            ...cacheRef.current,
            [monthKey]: { data, timestamp: Date.now() }
            };
            localStorage.setItem('apodCache', JSON.stringify(cacheRef.current));

          setError(null);
        } catch (error) {
          if (!isMounted.current) return; // avoid setting state if the component is unmounted
          console.error(error);
          setError('Failed to load NASA APOD data');
        } finally {
          if (!isMounted.current) return; // avoid setting state if the component is unmounted
          setIsLoading(false);
        }
      }

      fetchApodData();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeout); // cleanup timeout on unmount
  }, [activeStartDate]);

  return { calendarData, error, isLoading };
}
