"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Hello Universe</h1>
      </div>

      <div className={styles.navContainer}>
        <button onClick={handleClick} className={styles.menuButton}>
          ☰
        </button>

        <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/apod">Astronomy Picture of the Day</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}