'use server'

import prisma from '@/lib/prisma'
import { tokenDecoded } from '@/lib/utils/auth'
import { WorkAreaType } from '@prisma/client'
import { InputJsonValue } from '@prisma/client/runtime/library'
import { redirect } from 'next/navigation'

export async function createWorkArea(formData: FormData) {

  const token = await tokenDecoded()
  console.log(token)

  const workAreaData = {
    name: formData.get('name') as string,
    type: formData.get('type') as WorkAreaType,
    restrictionLevel: formData.get('restrictionLevel') as any,
    startTime: new Date(formData.get('startTime') as string),
    endTime: new Date(formData.get('endTime') as string),
    description: formData.get('description') as string,
    rerouting: formData.get('rerouting') as string,
    autoEnd: formData.get('autoEnd') === 'true',
    area: formData.get('area') as InputJsonValue,
    createdBy: {
      connect: { email: token.email }
    },
  }

  const workArea = await prisma.workArea.create({
    data: workAreaData
  })

  if (workArea) {
    redirect(`/intern/warnungen/${workArea.id}`)
  }

  return workArea
}