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

    const forestries = await prisma.forestryRange.createMany({
      data: [
        {
          name: 'Pirna',
          number: 3452,
        },
        {
          name: 'Dresden',
          number: 3453,
        },
        {
          name: 'Grimma',
          number: 3454,
        },
        {
          name: 'Radebeul',
          number: 3455,
        },
        {
          name: 'Freital',
          number: 3456,
        },
        {
          name: 'Pulsnitz',
          number: 3457,
        },
        {
          name: 'Meißen',
          number: 3458,
        },
        {
          name: 'Riesa',
          number: 3459,
        },
        {
          name: 'Dippoldiswalde',
          number: 3460,
        },
        {
          name: 'Sebnitz',
          number: 3461,
        },
        {
          name: 'Bad Schandau',
          number: 3462,
        },
      ],
    })
    console.log('Seed data inserted successfully:')
    console.log(user)
    console.log(forestries)
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
