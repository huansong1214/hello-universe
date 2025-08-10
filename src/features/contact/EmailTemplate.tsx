// Define the expected props for the EmailTemplate component.
interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

// Functional component to render an email-friendly template.
export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    // Container for the email content.
    <div>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Message: </p>
      <p>{message}</p>
    </div>
  );
}
