import { forwardRef, type InputHTMLAttributes } from 'react';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { type = 'text', className, ...props },
  ref,
) {
  return (
    <input
      type={type}
      ref={ref}
      className={clsx(
        'w-full bg-[#334650] border border-[#56b3b4] rounded-md p-2 my-2',
        className,
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export { Input };
