import { useEffect, useState } from "react";

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

const formatDate = (date: Date) => date.toISOString().split('T')[0];
const getMonthKey = (date: Date) =>
  `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

export function useApodCalendarData(activeStartDate: Date) {
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [cache, setCache] = useState<Record<string, CalendarData>>(() => {
    // load cache from localStorage if available
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('apodCache');
        return stored ? JSON.parse(stored) : {};
      } catch (err) {
        console.warn('Failed to parse APOD cache:', err)
        return {};
      }
    }
    return {};
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const today = new Date();
      const year = activeStartDate.getFullYear();
      const month = activeStartDate.getMonth();
      const monthKey = getMonthKey(activeStartDate);

      if (cache[monthKey]) {
        console.log(`[Cache] Using cached data for ${monthKey}`);
        setCalendarData(cache[monthKey]);
        setError(null);
        setIsLoading(false);
        return;
      }

      if (
        year > today.getFullYear() ||
        (year === today.getFullYear() && month > today.getMonth())
      ) {
        setCalendarData({});
        setError(null);
        setIsLoading(false);
        return;
      }

      async function fetchApodData() {
        setIsLoading(true);
        try {
          const startDate = new Date(year, month, 1);
          let endDate = new Date(year, month + 1, 0);
          if (year === today.getFullYear() && month === today.getMonth() && today < endDate) {endDate = today;}

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

          setCalendarData(data);

          // use functional update to avoid stale closure
          setCache(prev => {
            const updatedCache = { ...prev, [monthKey]: data};
            localStorage.setItem('apodCache', JSON.stringify(updatedCache));
            return updatedCache;
          });

          setError(null);
        } catch (err) {
          console.error(err);
          setError('Failed to load NASA APOD data');
        } finally {
          setIsLoading(false);
        }
      }

      fetchApodData();
    }, 500); // 500ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [activeStartDate, cache]);

  return { calendarData, error, isLoading };
}
