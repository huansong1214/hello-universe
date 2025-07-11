import { forwardRef, type TextareaHTMLAttributes, type Ref } from 'react';
import clsx from 'clsx';

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}

function TextareaComponent(
  { className, ...props }: TextareaProps,
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
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  TextareaComponent,
);

Textarea.displayName = 'Textarea';

export { Textarea };
