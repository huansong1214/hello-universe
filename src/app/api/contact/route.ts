import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ZodError } from 'zod';

import {
  contactSchema,
  type ContactFormData,
} from '@/features/contact/contactSchema';
import { EmailTemplate } from '@/features/contact/EmailTemplate';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable.');
}

// Resend setup
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // parse the incoming request body
    const json = await req.json();

    // validate the request data against the schema
    const data: ContactFormData = contactSchema.parse(json);

    // destructure relevant data for the email
    const { name, email, message } = data;

    // send the email using the Resend API
    const { data: resendData, error } = await resend.emails.send({
      from: 'Hello Universe <onboarding@resend.dev>',
      to: ['huansong1214@gmail.com'],
      subject: 'New Contact Form Submission',
      react: EmailTemplate({ name, email, message }),
    });

    // handle errors from Resend API
    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.'},
        { status: 500 }
      );
    }

    // return success response with the Resend data
    return NextResponse.json(resendData);

  } catch (error) {
    // handle form validation errors (Zod validation errors)
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid form submission.', details: error.errors },
        { status: 400 }
      );
    }

    // handle any unexpected errors
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later' },
      { status: 500 }
    );
  }
}
