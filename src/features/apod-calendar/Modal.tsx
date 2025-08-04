import React from 'react';

import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  apod: {
    media_type: 'image' | 'video' | 'other';
    url?: string; // 'other' media type may not have a url
    date: string;
    title: string;
    explanation: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, apod }) => {
  if (!isOpen) return null;

  const formattedDate = apod.date.replace(/-/g, '').slice(2); // 2025-05-18 => 250518
  const nasaUrl = `https://apod.nasa.gov/apod/ap${formattedDate}.html`;

  const renderMediaContent = () => {
    if (apod.media_type === 'image') {
      return <img src={apod.url} alt={apod.title} />;
    } else if (apod.media_type === 'video') {
      if (apod.url?.includes('youtube.com')) {
        return (
          <iframe
            src={apod.url}
            title={apod.title}
            allowFullScreen
            aria-label={apod.title}
          />
        );
      } else {
        // fallback for non-Youbube url (eg html page for 2025-03-02)
        return (
          <p className={styles.mediaOther}>
          View content on <a href={nasaUrl} target='_blank' rel='noopener noreferrer' className={styles.nasaUrl}>NASA APOD page</a>.
        </p>
        );
      }
    } else if (apod.media_type === 'other') {
      return (
        <p className={styles.mediaOther}>
          Watch video on <a href={nasaUrl} target='_blank' rel='noopener noreferrer' className={styles.nasaUrl}>NASA APOD page</a>.
        </p>
      );
    } else {
      return <p className={styles.error}>Sorry, no media available for this content.</p>;
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <div className={styles.grid}>
          <div className={styles.imageContainer}>
            {renderMediaContent()}
          </div>
          <div className={styles.textContainer}>
            <h2>{apod.date}</h2>
            <h3 className={styles.heading3}>{apod.title}</h3>
            <p>{apod.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
