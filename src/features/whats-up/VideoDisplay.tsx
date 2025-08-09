'use client';

import { useEffect, useState } from 'react';

import styles from './VideoDisplay.module.css';

interface Video {
  title: string;
  description: string;
  videoId: string;
}

// Cache key used in localStorage.
const CACHE_KEY = 'latestYoutubeVideo';

export default function VideoDisplay() {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Calculate time in milliseconds until the 1st of next month.
  const getCacheDuration = (): number => {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return nextMonth.getTime() - now.getTime();
  };

  useEffect(() => {
    async function fetchVideo() {
      try {
        // Try to load cached data.
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const now = Date.now();

          // Check if cached data is still valid.
          if (now - parsed.timestamp < getCacheDuration()) {
            setVideo(parsed.data);
            setLoading(false);
            return;
          }
        }

        // No valid cache, fetch fresh data from YouTube API.
        const response = await fetch('/api/whats-up');
        const data = await response.json();

        setVideo(data);

        // Store fresh data in localStorage with current timestamp
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, []);

  if (loading) return <div className={styles.loading}>Loading video...</div>;
  if (!video) return <div className={styles.error}>Error fetching video data.</div>;

  return (
    <div className={styles.grid}>
      <div className={styles.videoContainer}>
        <iframe
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title={video.title}
          allowFullScreen
        />
      </div>
      <div className={styles.textContainer}>
        <h3 className={styles.heading3}>{video.title}</h3>
        <p>{video.description}</p>
      </div>
    </div>
  );
}
