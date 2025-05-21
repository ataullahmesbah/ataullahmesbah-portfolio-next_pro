import { Resend } from 'resend';

// Function to escape HTML special characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, "\"")
        .replace(/'/g, "'");
}

export async function POST(request) {
    try {
        const resend = new Resend(process.env.RESEND_WEB_API_KEY);
        const { email, phone, comment } = await request.json();

        // Validate required fields
        if (!email || !phone || !comment) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // Escape user inputs to prevent HTML injection
        const safeEmail = escapeHtml(email);
        const safePhone = escapeHtml(phone);
        const safeComment = escapeHtml(comment);

        // Send email using Resend with styled HTML
        const { data, error } = await resend.emails.send({
            from: 'Team WEB <onboarding@resend.dev>', // Verified sender
            to: ['ataullah.mesbah486@gmail.com'], // Your verified email
            subject: `Web Development Inquiry from ${safeEmail}`,
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Web Development Inquiry</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f4;">
                    <table role="presentation" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="padding: 20px; background-color: #111827; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 22px;">📩 New Web Development Inquiry</h1>
                                <p style="color: #d1d5db; font-size: 14px; margin-top: 8px;">
                                    Received on ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}
                                </p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding: 30px; background-color: #f9fafb;">
                                <h2 style="color: #111827; font-size: 20px; margin-bottom: 16px;">👋 Hello Ataullah,</h2>
                                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                                    You’ve received a new web development inquiry through your website’s form. Here's the full submission:
                                </p>
                                <table role="presentation" width="100%" style="border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 16px; color: #111827;"><strong>📧 Email:</strong></td>
                                        <td style="padding: 8px 0; font-size: 16px; color: #4b5563;">${safeEmail}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-size: 16px; color: #111827;"><strong>📞 Phone:</strong></td>
                                        <td style="padding: 8px 0; font-size: 16px; color: #4b5563;">${safePhone}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 10px 0; font-size: 16px; color: #111827;">
                                            <strong>📝 Comment:</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 6px 12px; font-size: 16px; color: #4b5563; background-color: #f3f4f6; border-radius: 6px;">
                                            ${safeComment}
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding: 20px; background-color: #f8f9fa; text-align: center; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                <p style="color: #777777; font-size: 14px; margin: 0;">
                                    Sent from <a href="https://ataullahmesbah.com" style="color: #007bff; text-decoration: none;">Ataullah Mesbah</a>
                                </p>
                                <p style="color: #777777; font-size: 14px; margin: 5px 0;">
                                    © ${new Date().getFullYear()} Ataullah Mesbah. All rights reserved.
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