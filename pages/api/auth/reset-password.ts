import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const resetPasswordHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { token, password } = req.body;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password }
    });

    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id }
    });

    res.status(200).end();
  } else {
    res.status(405).end();
  }
};

export default resetPasswordHandler;