import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

function Label({ children, ...props }: LabelProps) {
    return <label {...props}>{children}</label>;
}

export { Label };
