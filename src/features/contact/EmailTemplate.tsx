// Define the expected props for the EmailTemplate component
interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export function EmailTemplate({ name, email, message }: EmailTemplateProps) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Message: </p>
      <p>{message}</p>
    </div>
  );
}
