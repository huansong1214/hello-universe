import { clsx } from 'clsx';
import { forwardRef, type TextareaHTMLAttributes, type Ref } from 'react';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref: Ref<HTMLTextAreaElement>,
) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full bg-[var(--muted)] border border-[var(--success)] rounded-md p-2 my-2',
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
