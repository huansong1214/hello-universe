import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';
import { tv } from 'tailwind-variants';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary';
  active?: boolean;
};

const button = tv({
  base: 'rounded-md px-4 py-2 my-2 hover:cursor-pointer',
  variants: {
    variant: {
      primary:
        'bg-[var(--primary)] text-[var(--background)] hover:text-[var(--foreground)]',
    },
    active: {
      true: 'text-[var(--foreground)] hover:text-[var(--foreground)] hover:cursor-default',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

function Button({ className, variant, active, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(button({ variant, active }), className)}
      {...props}
    />
  );
}

export { Button };
