import nodemailer from 'nodemailer';

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOTP = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Generate current date dynamically
    const currentDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Dhaka', // Change as per your region
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });

    const mailOptions = {
        from: `Team Ataullah Mesbah <noreply@gmail.com>`, // Brand Name + Email ID
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`, // Plain text version
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
               
            <div style="text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 15px;">
                    <h2 style="">Team Ataullah Mesbah</h2>
                    <p style="margin: 0;">${currentDate}</p>
                </div>
            <div style="text-align: center;">
                    <h2 style="color: #4CAF50;">Your One-Time Password</h2>
                    <p>Here is your One-Time Password to securely log in to your Ataullah Mesbah account:</p>
                    <h3 style="color: #4CAF50; font-size: 24px; margin: 20px 0;">${otp}</h3>
                    <p><strong>Note:</strong> This OTP is valid for 5 minutes.</p>
                </div>
               <div style="text-align: center; margin-top: 30px;">
                    <p>
                        <a href="https://facebook.com/ataullahmesbah10" style="color: #4CAF50; text-decoration: none;">Facebook</a> | 
                        <a href="https://youtube.com/@ataullah.mesbah" style="color: #4CAF50; text-decoration: none;">YouTube</a> | 
                        <a href="https://x.com/ataullah_mesbah" style="color: #4CAF50; text-decoration: none;">Twitter</a>
                    </p>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <p>Website: <a href="https://ataullahmesbah.com" style="color: #4CAF50; text-decoration: none;">ataullahmesbah.com</a></p>
                </div>
            </div>
        `, // HTML version
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP successfully sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP');
        throw new Error('Failed to send OTP. Please try again later.');
    }
};
