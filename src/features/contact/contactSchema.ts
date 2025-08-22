// Import the Zod validation library
import { z } from 'zod';

// Define a schema for the contact form using Zod
export const contactSchema = z.object({
  name: z.string().min(1, 'Please enter your name.'),
  email: z.string().email('Please provide an email address.'),
  message: z.string().min(10, 'Please write at least 10 characters.'),
});

// Generate a TypeScript type based on the schema
export type ContactFormData = z.infer<typeof contactSchema>;
