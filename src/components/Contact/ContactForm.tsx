'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

import styles from './ContactForm.module.css';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
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

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.fieldsContainer}>
          {/* name */}
          <div className={styles.formItem}>
            <label htmlFor="name" className={styles.label}>
              Name
            </label>
            <Input
              id="name"
              placeholder="Your name here"
              {...register('name')}
              className={styles.input}
            />
            <p className={styles.error}>{errors.name?.message || '\u00A0'}</p>
          </div>

          {/* email */}
          <div className={styles.formItem}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Your email here"
              {...register('email')}
              className={styles.input}
            />
            <p className={styles.error}>{errors.email?.message || '\u00A0'}</p>
          </div>

          {/* message */}
          <div className={styles.formItem}>
            <label htmlFor="message" className={styles.label}>
              Message
            </label>
            <Textarea
              id="message"
              rows={5}
              placeholder={`Your feedback helps us improve. \nThank you for sharing!`}
              {...register('message')}
              className={styles.textarea}
            />
            <p className={styles.error}>
              {errors.message?.message || '\u00A0'}
            </p>
          </div>

          {/* submit */}
          <Button type="submit" className={styles.button}>
            Send Message
          </Button>

          {/* feedback */}
          {success && (
            <p className={styles.success}>Message sent successfully</p>
          )}
        </div>
      </form>
    </div>
  );
}
