"use server"

import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export const deleteArea = async (areaId: number) => {
  await prisma.area.delete({
    where: { id: areaId }
  })
  redirect('/intern/warnungen')
}