import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

export async function POST(request: Request) {
  if (!process.env.SENDGRID_API_KEY || !process.env.CONTACT_EMAIL_RECIPIENT || !process.env.SENDGRID_FROM_EMAIL) {
    console.error('Missing required environment variables for email sending with SendGrid.');
    return NextResponse.json(
      { message: 'Server is not configured for sending emails.' },
      { status: 500 }
    );
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    const { name, email, subject, message } = await request.json();

    const msg = {
      to: process.env.CONTACT_EMAIL_RECIPIENT,
      from: {
        name: 'DukaanMitra Contact Form',
        email: process.env.SENDGRID_FROM_EMAIL
      },
      replyTo: {
        name: name,
        email: email
      },
      subject: `New DukaanMitra Contact Form: ${subject}`,
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <h3>Message:</h3>
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
    };

    await sgMail.send(msg);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email sending error:', error);
    if (error.response) {
      console.error(error.response.body)
    }
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}
