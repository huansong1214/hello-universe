import clsx from 'clsx';

import type { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'bg-[#c693c6] text-[var(--background)] rounded-md px-4 py-2 my-2 hover:text-[var(--foreground)] hover:cursor-pointer',
        className,
      )}
      {...props}
    />
  );
}

export { Button };
