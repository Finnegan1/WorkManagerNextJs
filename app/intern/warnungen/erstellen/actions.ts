'use server'

import prisma from '@/lib/prisma'
import { tokenDecoded } from '@/lib/utils/auth'
import { Area, WorkAreaRestrictionLevel, WorkAreaType } from '@prisma/client'
import { InputJsonValue } from '@prisma/client/runtime/library'
import { redirect } from 'next/navigation'

export const getForestryRanges = async () => {
  const forestryRanges = await prisma.forestryRange.findMany()
  return forestryRanges
}

export async function createArea(formData: FormData) {
  const token = await tokenDecoded()
  console.log(token)

  const areaData: Partial<Area> = {
    shortDescription: formData.get('shortDescription') as string,
    information: formData.get('information') as string,
    startTime: new Date(formData.get('startTime') as string),
    endTime: new Date(formData.get('endTime') as string),
    workDescription: formData.get('workDescription') as string,
    forestSection: formData.get('forestSection') as string,
    trailsInArea: (formData.get('trailsInArea') as string).split(',').map(trail => trail.trim()),
    restrictionLevel: formData.get('restrictionLevel') as WorkAreaRestrictionLevel,
    restrictedAreas: JSON.parse(formData.get('restrictedAreas') as string),
    rerouting: JSON.parse(formData.get('rerouting') as string),
  }

  const area = await prisma.area.create({
    data: {
      ...areaData,
      createdBy: {
        connect: { email: token.email! }
      },
      forestryRange: {
        connect: { id: Number(formData.get('forestryRangeId')) }
      }
    } as any, // Type assertion to bypass type checking
  })

  if (area) {
    redirect(`/intern/warnungen/${area.id}`)
  }

  return area
}