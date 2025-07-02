"use client";

import React from "react";
import {
    useForm,
    Controller,
    FormProvider,
    useFormContext,
    useFormState,
    FieldPath,
    get,
}   from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ZodSchema, TypeOf } from "zod";

// main form wrapper
type FormProps<TSchema extends ZodSchema<any>> = {
    schema: TSchema;
    onSubmit: (value: TypeOf<TSchema>) => void;
    children: React.ReactNode;
};

export function Form<TSchema extends ZodSchema<any>>({
    schema,
    onSubmit,
    children
}: FormProps<TSchema>) {
    const methods = useForm<TypeOf<TSchema>>({
        resolver: zodResolver(schema),
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
        </FormProvider>
    );
}

// wraps a single form field with Controller
type FormFieldProps<T>= {
    name: FieldPath<T>;
    children: (field: {
        value: any;
        onChange: (...event: any[]) => void;
        onBlur: () => void;
        ref: React.Ref<any>;
    }) => React.ReactNode;
};

export function FormField<T>({ name, children }: FormFieldProps<T>) {
    const { control } = useFormContext<T>();
    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) => children(field)}
        />
    );
}

// wraps field with layout and error/message
type FormItemProps = {
    children: React.ReactNode;
    className?: string;
};

export function FormItem({ children, className = "mb-4" }: FormItemProps) {
    return <div className={className}>{children}</div>;
}

// label
type FormLabelProps = {
    children: React.ReactNode;
    htmlFor?: string;
    className?: string;
};

export function FormLabel({ children, htmlFor, className = "mb-4", ...props }: FormLabelProps) {
    return <label htmlFor={htmlFor} className={className} {...props}>{children}</label>;
}

// input wrapper
type FormControlProps = {
    children: React.ReactNode;
    className?: string;
};

export function FormControl({ children, className = "mb-4" }: FormControlProps) {
    return <div className={className}>{children}</div>;
}

// decription helper text
type FormDescriptionProps = {
    children: React.ReactNode;
    className?: string;
};

export function FormDescription({ children, className = "mb-4" }: FormDescriptionProps) {
    return <p className={className}>{children}</p>;
}

// displays validation message
type FormMessageProps<T> = {
    name: FieldPath<T>;
    className?: string;
};

export function FormMessage<T>({ name, className = "text-red-600 mb-4" }: FormMessageProps<T>) {
    const { errors } = useFormState<T>();
    const error = get(errors, name);

    if (!error || typeof error.message !== "string") return null;

    return <p className={className}>{error.message}</p>;
}
