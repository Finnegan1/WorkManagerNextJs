"use server"

import prisma from "@/lib/prisma";

export async function fetchWorkAreas(startDate: Date, endDate: Date) {

  console.log('Fetching work areas for date range:', startDate, endDate);
  return prisma.area.findMany({
    where: {
      OR: [
        {
          startTime: { lte: startDate },
          endTime: { gte: startDate }
        },
        {
          startTime: { gte: startDate, lte: endDate },
        },
        {
          endTime: { gte: startDate, lte: endDate },
        },
      ]
    },
  })
}