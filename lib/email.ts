import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (email: string, password: string) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your new password',
    text: `Your new password is: ${password}`
  };

  await transporter.sendMail(mailOptions);
};