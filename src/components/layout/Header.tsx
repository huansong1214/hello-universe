'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import styles from './Header.module.css';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleClick = () => setIsOpen(!isOpen);

  // Close menu when clicking outside of nav or button.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        isOpen &&
        navRef.current &&
        !navRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Toggle 'menuOpen' class on <body> to prevent embedded media (video/iframe)
  // from intercepting clicks.
  useEffect(() => {
    document.body.classList.toggle('menuOpen', isOpen);
    return () => document.body.classList.remove('menuOpen');
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Hello Universe</h1>
      </div>

      <div className={styles.navContainer}>
        {/* Hamburger menu button */}
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

        {/* Navigation links */}
        <nav
          ref={navRef}
          className={`${styles.nav} ${isOpen ? styles.open : ''}`}
        >
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/apod">APOD Calendar</Link>
            </li>
            <li>
              <Link href="/mars-rovers">Mars Rovers</Link>
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
