import nodemailer, { SentMessageInfo } from 'nodemailer';

export const sendAccountCreatedEmail = async (email: string, password: string) : Promise<SentMessageInfo> => {
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
    subject: 'Your new account',
    text: `Your new account is created.\n\nYour password is: ${password}\nPlease change your password after logging in as soon as possible.`
  };

  const result = await transporter.sendMail(mailOptions);
  console.log(result)
  return result
};