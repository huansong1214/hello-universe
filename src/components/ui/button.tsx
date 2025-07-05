import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className, ...props }: ButtonProps) {
  return (
    <button 
      className={clsx(
        'bg-[#c693c6] text-[var(--background)] rounded-md px-4 py-2 my-2 mx-auto hover:bg-[#aa7eaa] hover:cursor-pointer',
        className
      )}
      {...props} 
    />
  );
}

export { Button };
