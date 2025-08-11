import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ZodError } from 'zod';

import {
  contactSchema,
  type ContactFormData,
} from '@/features/contact/contactSchema';
import { EmailTemplate } from '@/features/contact/EmailTemplate';

// Ensure API key is set before initializing Resend client.
if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable.');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Parse the incoming JSON body from the request.
    const json = await req.json();

    // Validate and parse request data using Zod schema.
    const data: ContactFormData = contactSchema.parse(json);

    // Destructure validated data for convenience.
    const { name, email, message } = data;

    // Send email via Resend SDK with a React-based email template.
    const { data: resendData, error } = await resend.emails.send({
      from: 'Hello Universe <onboarding@resend.dev>',
      to: ['huansong1214@gmail.com'],
      subject: 'New Contact Form Submission',
      react: EmailTemplate({ name, email, message }),
    });

    // Handle errors from Resend email sending.
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    // Return successful Resend response data as JSON.
    return NextResponse.json(resendData);
  } catch (error) {
    if (error instanceof ZodError) {
      // Return validation errors with 400 Bad Request status.
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    // Handle unexpected server errors with 500 Internal Server Error status.
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
