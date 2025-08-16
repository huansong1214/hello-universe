import { clsx } from 'clsx';
import { forwardRef, type InputHTMLAttributes } from 'react';

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { type = 'text', className, ...props },
  ref,
) {
  return (
    <input
      type={type}
      ref={ref}
      className={clsx(
        'w-full bg-[var(--muted)] border border-[var(--success)] rounded-md p-2 my-2',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
