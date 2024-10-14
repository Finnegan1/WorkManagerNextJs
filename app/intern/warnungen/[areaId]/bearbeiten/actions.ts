"use server"

import prisma from "@/lib/prisma";
import { tokenDecoded } from "@/lib/utils/auth";
import { ChangeType, WorkAreaRestrictionLevel } from "@prisma/client";
import { Area } from "@prisma/client";
import { redirect } from "next/navigation";


export async function updateArea(areaId: number, formData: FormData) {

  const token = await tokenDecoded()

  const areaData: Partial<Area> = {
    shortDescription: formData.get('shortDescription') as string,
    information: formData.get('information') as string,
    startTime: new Date(formData.get('startTime') as string),
    endTime: new Date(formData.get('endTime') as string),
    workDescription: formData.get('workDescription') as string,
    forestSection: formData.get('forestSection') as string,
    trailsInArea: (formData.get('trailsInArea') as string).split('&,&').map(trail => trail.trim()),
    restrictionLevel: formData.get('restrictionLevel') as WorkAreaRestrictionLevel,
    restrictedAreas: JSON.parse(formData.get('restrictedAreas') as string),
    rerouting: JSON.parse(formData.get('rerouting') as string),
  }

  const previousAreaValues = await prisma.area.findUnique({
    where: { id: areaId }
  })

  if (!previousAreaValues) {
    return null
  }

  const area = await prisma.area.update({
    where: { id: areaId },
    data: {
      ...areaData,
      forestryRange: {
        connect: { id: Number(formData.get('forestryRangeId')) }
      }
    } as any, // Type assertion to bypass type checking
  })

  if (area) {

    await prisma.areaChangeLog.create({
      data: {
        areaId: area.id,
        changeType: ChangeType.UPDATED,
        previousValues: previousAreaValues,
        newValues: area,
        changedById: token.user.id
      }
    })

    redirect(`/intern/warnungen/${area.id}`)
  }

  return area
}
