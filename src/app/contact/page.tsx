import ContactForm from '@/components/Contact/ContactForm';

import styles from './contact.module.css';

export default function ContactPage() {
  return (
    <main>
      <h1 className={styles.heading}>Contact Us</h1>
      <ContactForm />
    </main>
  );
}
