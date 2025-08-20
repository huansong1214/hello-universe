import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ZodError } from 'zod';

import {
  contactSchema,
  type ContactFormData,
} from '@/features/contact/contactSchema';
import { EmailTemplate } from '@/features/contact/EmailTemplate';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function POST(req: Request) {
  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Missing RESEND_API_KEY environment variable.' },
      { status: 500 },
    );
  }

  const resend = new Resend(RESEND_API_KEY);

  try {
    const json = await req.json();
    const data: ContactFormData = contactSchema.parse(json);
    const { name, email, message } = data;

    const resendData = await resend.emails.send({
      from: 'Hello Universe <onboarding@resend.dev>',
      to: ['huansong1214@gmail.com'],
      subject: 'New Contact Form Submission',
      react: EmailTemplate({ name, email, message }),
    });

    return NextResponse.json(resendData);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }

    console.error(
      '[Resend API]',
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      { error: 'Unexpected server error. Please try again later.' },
      { status: 500 },
    );
  }
}
