import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  try {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash('admin', saltRounds)

    const user = await prisma.user.upsert({
      where: { email: 'admin@admin.de' },
      update: {},
      create: {
        email: 'admin@admin.de',
        name: 'admin',
        password: hashedPassword,
      },
    })
    console.log('Seed data inserted successfully:')
    console.log(user)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

main()
  .catch((e) => {
    console.error('Unhandled error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
