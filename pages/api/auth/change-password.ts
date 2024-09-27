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

  //or toke is expires
  if (!token || token.exp < Date.now() / 1000) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { oldPassword, newPassword } = req.body

  console.log(oldPassword, newPassword)

  const user = await prisma.user.findUnique({
    where: { email: token.user.email },
  })

  console.log(user)

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const isMatch = await compare(oldPassword, user.password)

  console.log(isMatch)

  if (!isMatch) {
    return res.status(400).json({ message: 'Old password is incorrect' })
  }

  const hashedPassword = await hash(newPassword, 10)

  const updatedUser = await prisma.user.update({
    where: { email: token.user.email },
    data: { password: hashedPassword },
  })

  console.log(updatedUser)

  res.status(200).json({ message: 'Password changed successfully' })
}

// Export the function
export default changePassword