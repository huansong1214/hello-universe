import React, { forwardRef } from 'react';
import clsx from 'clsx';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function TextareaComponent(
  { className, ...props }: TextareaProps,
  ref: React.Ref<HTMLTextAreaElement>,
) {
  return (
    <textarea
      ref={ref}
      className={clsx(
        'w-full bg-[#334650] border border-[#56b3b4] rounded-md p-2 my-2',
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
