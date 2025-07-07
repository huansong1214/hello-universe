import { NextResponse } from 'next/server';
import { Resend } from 'resend';

import { EmailTemplate } from 'emails/ContactEmail';

if (!process.env.RESEND_API_KEY) {
  throw new Error('Missing RESEND_API_KEY environment variable');
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'Hello Universe <onboarding@resend.dev>',
      to: ['huansong1214@gmail.com'],
      subject: 'New Contact Form Submission',
      react: EmailTemplate({ name, email, message }),
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
