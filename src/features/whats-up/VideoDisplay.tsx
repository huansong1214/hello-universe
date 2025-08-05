'use client';

import { useEffect, useState } from 'react';

import styles from './VideoDisplay.module.css';

interface Video {
  title: string;
  description: string;
  videoId: string;
}

export default function VideoDisplay() {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchVideo() {
      try {
        const response = await fetch('/api/whats-up');
        const data = await response.json();
        setVideo(data);
      } catch (error) {
        console.error('Error fetching YouTube data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchVideo();
  }, []);

  if (loading) return (
    <div className={styles.loading}>Loading video...</div>
  );
  if (!video) return (
    <div className={styles.error}>Error fetching video data.</div>
  );

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
