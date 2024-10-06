import { hash, compare } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt'

const changePassword = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const token = await getToken({ req })

  console.log(token)

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const expires = new Date(Number(token.exp) * 1000)
  const now = new Date()
  if (expires < now) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { oldPassword, newPassword }: {
    oldPassword: string | null,
    newPassword: string | null
  } = req.body

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old password and new password are required' })
  }

  const user = await prisma.user.findUnique({
    where: { email: token.user.email },
  })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const isMatch = await compare(oldPassword, user.password)

  if (!isMatch) {
    return res.status(400).json({ message: 'Old password is incorrect' })
  }

  const hashedPassword = await hash(newPassword, Number(process.env.NEXTAUTH_SALT))

  await prisma.user.update({
    where: { email: token.user.email },
    data: { password: hashedPassword },
  })

  res.status(200).json({ message: 'Password changed successfully' })
}

// Export the function
export default changePassword