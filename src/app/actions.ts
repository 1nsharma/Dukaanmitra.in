"use server";

import * as z from "zod";

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(500),
});

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

type State = {
    message: string;
    success: boolean;
};

export async function handleContactForm(prevState: State, formData: FormData) {
    const validatedFields = contactFormSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
    });

    if (!validatedFields.success) {
        return {
            message: "Invalid form data. Please check your inputs.",
            success: false,
        };
    }

    // Here you would typically send an email, save to a database, etc.
    console.log("Contact form submitted:", validatedFields.data);

    // Simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        message: "Your message has been sent successfully!",
        success: true,
    };
}


export async function handleLogin(prevState: State, formData: FormData) {
    const validatedFields = loginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Invalid credentials. Please check your inputs.',
            success: false,
        };
    }

    console.log("Login attempt:", validatedFields.data.email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real app, you would verify credentials and create a session
    // For now, we'll just simulate a failed login for demonstration
    return {
        message: 'Login failed. Please check your email and password.',
        success: false
    }
}
