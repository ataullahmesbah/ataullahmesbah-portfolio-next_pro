// app/api/contact/contact-form/route.justify-normal

import { Resend } from 'resend';

export async function POST(request) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { firstName, lastName, email, phone, message } = await request.json();

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !message) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Send email using Resend with styled HTML
        const { data, error } = await resend.emails.send({
            from: 'Your Website <onboarding@resend.dev>', // Verified sender
            to: ['ataullah.mesbah486@gmail.com'], // Your verified email
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Contact Form Submission</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 20px; background-color: #007bff; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding: 30px;">
                                <h2 style="color: #333333; font-size: 20px; margin-bottom: 20px;">Hello Ataullah,</h2>
                                <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                                    You have received a new message from your website's contact form. Below are the details:
                                </p>
                                <table role="presentation" width="100%" style="border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 10px 0; font-size: 16px; color: #333333;"><strong>Name:</strong></td>
                                        <td style="padding: 10px 0; font-size: 16px; color: #555555;">${firstName} ${lastName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; font-size: 16px; color: #333333;"><strong>Email:</strong></td>
                                        <td style="padding: 10px 0; font-size: 16px; color: #555555;">${email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; font-size: 16px; color: #333333;"><strong>Phone:</strong></td>
                                        <td style="padding: 10px 0; font-size: 16px; color: #555555;">${phone}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; font-size: 16px; color: #333333;"><strong>Message:</strong></td>
                                        <td style="padding: 10px 0; font-size: 16px; color: #555555;">${message}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                <p style="color: #777777; font-size: 14px; margin: 0;">
                                    Sent from <a href="https://ataullahmesbah.com" style="color: #007bff; text-decoration: none;">Your Website</a>
                                </p>
                                <p style="color: #777777; font-size: 14px; margin: 5px 0;">
                                    &copy; ${new Date().getFullYear()} Ataullah Mesbah. All rights reserved.
                                </p>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        if (error) {
            throw new Error(error.message);
        }

        return new Response(JSON.stringify({ message: 'Email sent successfully', data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return new Response(JSON.stringify({ error: 'Failed to send email', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}