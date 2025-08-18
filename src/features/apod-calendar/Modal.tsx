import React from 'react';

import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  apod: {
    media_type: 'image' | 'video' | 'other';
    url?: string; // 'other' media type may not have a URL
    date: string;
    title: string;
    explanation: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, apod }) => {
  // Don't render modal if it's not open.
  if (!isOpen) return null;

  // Destructure APOD properties for easier access.
  const { media_type, url, date, title, explanation } = apod;

  // Format the date for NASA APOD URL (e.g., 2025-05-18 -> 250518)
  const formattedDate = date.replace(/-/g, '').slice(2);
  const nasaUrl = `https://apod.nasa.gov/apod/ap${formattedDate}.html`;

  // Function to render media content based on media_type.
  const renderMediaContent = () => {
    if (media_type === 'image') {
      // Display image with alt text as title.
      return <img src={url} alt={title} />;
    } else if (media_type === 'video') {
      if (url?.includes('youtube.com')) {
        // Embed YouTube video in iframe.
        return <iframe src={url} title={title} allowFullScreen />;
      } else {
        // For non-YouTube video URLs, link to NASA APOD page.
        return (
          <p className={styles.mediaOther}>
            View content on{' '}
            <a
              href={nasaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.nasaUrl}
            >
              NASA APOD page
            </a>
            .
          </p>
        );
      }
    } else if (media_type === 'other') {
      // For 'other' media type, link to NASA APOD page.
      return (
        <p className={styles.mediaOther}>
          Watch video on{' '}
          <a
            href={nasaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.nasaUrl}
          >
            NASA APOD page
          </a>
          .
        </p>
      );
    } else {
      // Fallback message if media type is unrecognized.
      return (
        <p className={styles.error}>
          Sorry, no media available for this content.
        </p>
      );
    }
  };

  return (
    // Overlay that closes modal when clicked.
    <div className={styles.modalOverlay} onClick={onClose}>
      {/* Modal content box; stop propagation to prevent closing when clicking inside */}
      <div
        className={styles.modalContent}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close button */}
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>

        {/* Grid layout for media and text */}
        <div className={styles.grid}>
          {/* Media container */}
          <div className={styles.imageContainer}>{renderMediaContent()}</div>

          {/* Text Container */}
          <div className={styles.textContainer}>
            <h2>{date}</h2>
            <h3 className={styles.heading3}>{title}</h3>
            <p>{explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
