'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import {
  contactSchema,
  type ContactFormData,
} from '@/features/contact/contactSchema';

import styles from './ContactForm.module.css';

export default function ContactForm() {
  // State to track successful submission.
  const [success, setSuccess] = useState(false);

  // Clear success message after 5 seconds.
  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timeout);
    }
  }, [success]);

  // Initialize react-hook-form with Zod schema validation.
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  // Handle form submission.
  async function handleFormSubmit(data: ContactFormData) {
    try {
      // Send form data as a POST request to API endpoint.
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Reset form on success.
      if (response.ok) {
        setSuccess(true);
        reset();
      } else {
        // Log server error response.
        const result = await response.json();
        console.error('Error sending message:', result.error);
        setSuccess(false);
      }
    } catch (error) {
      // Log unexpected errors.
      console.error('Form submission error:', error);
      setSuccess(false);
    }
  }

  // Collect all validation error messages from the errors object.
  const errorMessages = Object.values(errors)
    .map((error) => error?.message)
    .filter(Boolean);

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        {/* Validation error block */}
        {errorMessages.length > 0 && (
          <div className={styles.errorBlock}>
            <p>
              <strong>There was a problem.</strong>
            </p>
            <ul>
              {errorMessages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.fieldsContainer}>
          {/* Name field */}
          <div className={styles.formItem}>
            <Input
              id="name"
              placeholder="Name"
              autoComplete="name"
              {...register('name')}
              className={styles.input}
            />
          </div>

          {/* Email field */}
          <div className={styles.formItem}>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              {...register('email')}
              className={styles.input}
            />
          </div>

          {/* Message field */}
          <div className={styles.formItem}>
            <Textarea
              id="message"
              rows={5}
              placeholder="Message"
              {...register('message')}
              className={styles.textarea}
            />
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            Send
          </Button>

          {/* Success message */}
          {success && (
            <p className={styles.success}>Message sent successfully.</p>
          )}
        </div>
      </form>
    </div>
  );
}
