import 'server-only'

import nodemailer, { SentMessageInfo } from 'nodemailer';

export const sendAccountCreatedEmail = async (email: string, password: string): Promise<SentMessageInfo> => {
  try {
    const transporter = nodemailer.createTransport({
      name: 'workManagerClient',
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true,
      logger: true,
      dnsTimeout: 10000,
      socketTimeout: 10000,
      greetingTimeout: 10000,
      connectionTimeout: 10000,
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your new account',
      text: `Your new account is created.\n\nYour password is: ${password}\nPlease change your password after logging in as soon as possible.`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log(result)
    return result
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw error;
  }
};
