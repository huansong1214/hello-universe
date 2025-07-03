"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";

import styles from "./ContactForm.module.css";

// schema
const contactSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
    const [success, setSuccess] = useState(false);

    const onSubmit = (data: ContactFormData) => {
        try {
            console.log("Form submitted", data);
            // call an API or handle submission here
            setSuccess(true);
       } catch (error) {
            console.error("Form submission error:", error);
            setSuccess(false);
       }
    };

    return (
        <>
            <div className={styles.formContainer}>
                <Form schema={contactSchema} onSubmit={onSubmit}>
                    {/* name */}
                    <div className={styles.fieldsContainer}>
                        <FormField name="name">
                            {({ value = "", onChange, onBlur, ref }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="name"
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            ref={ref}
                                            placeholder="Your name here"
                                            className={styles.input}
                                        />
                                    </FormControl>
                                    <FormMessage name="name" />
                                </FormItem>
                            )}
                        </FormField>
                        
                        {/* email */}
                        <FormField name="email">
                            {({ value = "", onChange, onBlur, ref }) => (
                                <FormItem>
                                    <FormLabel htmlFor="email">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            ref={ref}
                                            placeholder="Your email here"
                                            className={styles.input}
                                        />
                                    </FormControl>
                                    <FormMessage name="email" />
                                </FormItem>
                            )}
                        </FormField>

                        {/* message */}
                        <FormField name="message">
                            {({ value = "", onChange, onBlur, ref }) => (
                                <FormItem>
                                    <FormLabel htmlFor="message">Message</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            id="message"
                                            value={value}
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            ref={ref}
                                            placeholder="Any feedback is appreciated..."
                                            rows={5}
                                            className={styles.textarea}
                                        />
                                    </FormControl>
                                    <FormMessage name="message" />
                                </FormItem>
                            )}
                        </FormField>

                        {/* submit */}
                        <Button type="submit" className={styles.button}>Send Message</Button>
                
                        {/* feedback message */}
                        {success && (
                            <p>Message sent successfully</p>
                        )}
                    </div>
                </Form>
            </div>
        </>
    );
}
