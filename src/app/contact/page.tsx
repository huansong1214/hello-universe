import ContactForm from 'features/contact/components/ContactForm';

import styles from './page.module.css';

export default function ContactPage() {
  return (
    <main className={styles.mainContainer}>
      <h1 className={styles.heading}>Contact</h1>
      <ContactForm />
    </main>
  );
}
