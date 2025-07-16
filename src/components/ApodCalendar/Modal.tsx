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

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(event) => event.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <div className={styles.grid}>
          <div className={styles.imageContainer}>
            {apod.media_type === 'image' ? (
              <img src={apod.url} alt={apod.title} />
            ) : (
              <iframe
                src={apod.url}
                title={apod.title}
                allow="fullscreen"
                allowFullScreen
              />
            )}
          </div>
          <div className={styles.textContainer}>
            <h2>{apod.date}</h2>
            <h3 className={styles.subheading}>{apod.title}</h3>
            <p>{apod.explanation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
