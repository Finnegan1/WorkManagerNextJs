import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { WorkAreaRestrictionLevel } from '@prisma/client'

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
        role: 'ADMIN',
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

    const forestryRanges = await prisma.forestryRange.findMany()

    const areas = await prisma.area.createMany({
      data: [
        {
          shortDescription: 'Holzernte im Tharandter Wald',
          information: 'Großflächige Holzernte mit schwerem Gerät',
          startTime: new Date('2024-10-01T07:00:00Z'),
          endTime: new Date('2024-10-31T18:00:00Z'),
          workDescription: 'Fällung und Abtransport von Fichten aufgrund von Borkenkäferbefall',
          forestSection: 'Abteilung 42, 43, 44',
          trailsInArea: ['Wanderweg Tharandt-Grillenburg', 'Fahrradweg R4'],
          restrictionLevel: WorkAreaRestrictionLevel.danger,
          restrictedAreas: JSON.stringify({
            type: 'Polygon',
            coordinates: [[[13.5, 50.9], [13.52, 50.9], [13.52, 50.91], [13.5, 50.91], [13.5, 50.9]]]
          }),
          rerouting: JSON.stringify({
            type: 'LineString',
            coordinates: [[13.49, 50.895], [13.53, 50.895], [13.53, 50.915], [13.49, 50.915]]
          }),
          forestryRangeId: forestryRanges.find((forestryRange) => forestryRange.name === 'Dresden')!.id,
          createdById: user.id, // Replace with actual admin user ID
        },
        {
          shortDescription: 'Waldpflege im Nationalpark Sächsische Schweiz',
          information: 'Entfernung von Totholz und invasiven Arten',
          startTime: new Date('2024-10-10T08:00:00Z'),
          endTime: new Date('2024-10-30T16:00:00Z'),
          workDescription: 'Selektive Entfernung von Totholz und Bekämpfung der Spätblühenden Traubenkirsche',
          forestSection: 'Sektor B3, B4',
          trailsInArea: ['Malerweg Etappe 7', 'Forststeig Elbsandstein'],
          restrictionLevel: WorkAreaRestrictionLevel.attention,
          restrictedAreas: JSON.stringify({
            type: 'Polygon',
            coordinates: [[[14.2, 50.9], [14.22, 50.9], [14.22, 50.91], [14.2, 50.91], [14.2, 50.9]]]
          }),
          rerouting: JSON.stringify({
            type: 'LineString',
            coordinates: [[14.19, 50.895], [14.23, 50.895], [14.23, 50.915], [14.19, 50.915]]
          }),
          forestryRangeId: forestryRanges.find((forestryRange) => forestryRange.name === 'Bad Schandau')!.id,
          createdById: user.id, // Replace with actual admin user ID
        },
        {
          shortDescription: 'Aufforstung im Colditzer Forst',
          information: 'Pflanzung von klimaresistenten Baumarten',
          startTime: new Date('2024-10-15T07:30:00Z'),
          endTime: new Date('2024-11-15T16:30:00Z'),
          workDescription: 'Pflanzung von Eichen, Buchen und Douglasien auf einer Kahlfläche',
          forestSection: 'Abteilung 17, 18',
          trailsInArea: ['Muldentalradweg'],
          restrictionLevel: WorkAreaRestrictionLevel.none,
          restrictedAreas: JSON.stringify({
            type: 'Polygon',
            coordinates: [[[12.8, 51.1], [12.82, 51.1], [12.82, 51.11], [12.8, 51.11], [12.8, 51.1]]]
          }),
          rerouting: JSON.stringify(null),
          forestryRangeId: forestryRanges.find((forestryRange) => forestryRange.name === 'Grimma')!.id,
          createdById: user.id, // Replace with actual admin user ID
        },
      ],
    })

    console.log('Seed data inserted successfully:')
    console.log(user)
    console.log(forestries)
    console.log(areas)
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
