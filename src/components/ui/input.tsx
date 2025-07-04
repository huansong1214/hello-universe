import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', ...props },
  ref,
) {
  return <input type={type} ref={ref} {...props} />;
});

Input.displayName = 'Input';

export { Input };
