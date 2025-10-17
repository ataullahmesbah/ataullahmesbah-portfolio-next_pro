// src/lib/otpUtils.js
import nodemailer from 'nodemailer';

// Generate OTP
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP via Email
export async function sendOTP(email, otp) {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Verify connection
        await transporter.verify();

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code - Login Verification',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #7C3AED;">Your Verification Code</h2>
                    <p>Hello,</p>
                    <p>Your One-Time Password (OTP) for login is:</p>
                    <div style="background: #7C3AED; color: white; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in 5 minutes.</p>
                    <p>If you didn't request this code, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply.</p>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
        
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP. Please try again later.');
    }
}