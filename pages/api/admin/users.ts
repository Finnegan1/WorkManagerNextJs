import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { email, role } = req.body;

    const password = Math.random().toString(36).slice(-8);
    const user = await prisma.user.create({
      data: {
        email,
        password,
        role
      }
    });

    await sendPasswordResetEmail(email, password);

    res.status(201).json(user);
  } else {
    res.status(405).end();
  }
};

// Export the function
export default createUser;