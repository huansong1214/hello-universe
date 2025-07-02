import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function TextareaComponent(
    props: TextareaProps,
    ref: React.Ref<HTMLTextAreaElement>
) {
    return <textarea ref={ref} {...props} />;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(TextareaComponent);

Textarea.displayName = "Textarea";

export { Textarea };
