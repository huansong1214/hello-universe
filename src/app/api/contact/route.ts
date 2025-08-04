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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const json = await req.json();

    const data: ContactFormData = contactSchema.parse(json);

    const { name, email, message } = data;

    const { data: resendData, error } = await resend.emails.send({
      from: 'Hello Universe <onboarding@resend.dev>',
      to: ['huansong1214@gmail.com'],
      subject: 'New Contact Form Submission',
      react: EmailTemplate({ name, email, message }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(resendData);
  } catch (error) {
    if (error instanceof ZodError) {
      // validation error
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    // server error
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
