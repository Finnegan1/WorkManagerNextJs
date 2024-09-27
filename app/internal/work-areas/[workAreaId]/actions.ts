"use server"

import prisma from "@/lib/prisma"
import { redirect } from "next/navigation"

export const deleteWorkArea = async (workAreaId: number) => {
  await prisma.workArea.delete({
    where: { id: workAreaId }
  })
  redirect('/internal/work-areas')
}