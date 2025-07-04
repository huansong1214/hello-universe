import * as React from 'react';

interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    <div>
      <h1>New Contact Form Submission</h1>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Message: </p>
      <p>{message}</p>
    </div>
  );
}
