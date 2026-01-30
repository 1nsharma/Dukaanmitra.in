import { NextResponse } from 'next/server';
import Mailgun from 'mailgun.js';
import formData from 'form-data';

export async function POST(request: Request) {
  const { MAILGUN_API_KEY, MAILGUN_DOMAIN, CONTACT_EMAIL_RECIPIENT, MAILGUN_FROM_EMAIL } = process.env;

  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN || !CONTACT_EMAIL_RECIPIENT || !MAILGUN_FROM_EMAIL) {
    console.error('Missing required environment variables for email sending with Mailgun.');
    return NextResponse.json(
      { message: 'Server is not configured for sending emails.' },
      { status: 500 }
    );
  }

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: MAILGUN_API_KEY });

  try {
    const { name, email, subject, message } = await request.json();

    const data = {
      from: MAILGUN_FROM_EMAIL,
      to: [CONTACT_EMAIL_RECIPIENT],
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
      'h:Reply-To': email,
    };

    await mg.messages.create(MAILGUN_DOMAIN, data);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { message: 'Failed to send message' },
      { status: 500 }
    );
  }
}
