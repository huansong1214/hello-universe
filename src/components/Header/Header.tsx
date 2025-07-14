'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Hello Universe</h1>
      </div>

      <div className={styles.navContainer}>
        <button
          ref={buttonRef}
          onClick={handleClick}
          className={`${styles.menuButton} ${isOpen ? styles.open : styles.closed}`}
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <nav
          ref={navRef}
          className={`${styles.nav} ${isOpen ? styles.open : ''}`}
        >
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/apod-calendar">APOD Calendar</Link>
            </li>
            <li>
              <Link href="/mars-rover-photos">Mars Rover Photos</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
