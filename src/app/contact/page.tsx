import ContactForm from '@/features/contact/ContactForm';

import styles from './page.module.css';

export default function ContactPage() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading1}>Contact</h1>
      <ContactForm />
    </main>
  );
}
