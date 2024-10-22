import nodemailer, { SentMessageInfo } from 'nodemailer';

export const sendAccountCreatedEmail = async (email: string, password: string): Promise<SentMessageInfo> => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true, // Enable debug output
      logger: true // Log to console
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new account',
      text: `Your new account is created.\n\nYour password is: ${password}\nPlease change your password after logging in as soon as possible.`
    };

    console.log('Attempting to send email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
