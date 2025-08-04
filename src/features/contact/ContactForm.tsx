'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

import {
  contactSchema,
  type ContactFormData,
} from '@/features/contact/contactSchema';

import styles from './ContactForm.module.css';

export default function ContactForm() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccess(true);
        reset();
      } else {
        const result = await response.json();
        console.error('Error sending message:', result.error);
        setSuccess(false);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSuccess(false);
    }
  };

  // create an array of error messages
  const errorMessages = Object.values(errors).map(
    (error) => error?.message || '',
  );

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* consolidated error block */}
        {errorMessages.length > 0 && (
          <div className={styles.errorBlock} role="alert" aria-live="assertive">
            <p>
              <strong>There was a problem.</strong>
            </p>
            <ul>
              {errorMessages.map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.fieldsContainer}>
          {/* name */}
          <div className={styles.formItem}>
            <Input
              id="name"
              placeholder="Name"
              autoComplete="name"
              {...register('name')}
              className={styles.input}
              aria-label="Full Name"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
          </div>

          {/* email */}
          <div className={styles.formItem}>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email')}
              className={styles.input}
              aria-label="Email"
              aria-invalid={errors.email ? 'true' : 'false'}
            />
          </div>

          {/* message */}
          <div className={styles.formItem}>
            <Textarea
              id="message"
              rows={5}
              placeholder={'Message'}
              {...register('message')}
              className={styles.textarea}
              aria-label="Message"
              aria-invalid={errors.message ? 'true' : 'false'}
            />
          </div>

          {/* submit */}
          <Button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            Send
          </Button>

          {/* feedback */}
          {success && (
            <p className={styles.success} role="status" aria-live="polite">
              Message sent successfully.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
